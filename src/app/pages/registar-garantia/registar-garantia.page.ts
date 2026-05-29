// Importações dos módulos centrais do Angular
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Ferramentas de Reactive Forms

// Importação do plugin nativo e serviço
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { GarantiasService } from '../../services/garantias.service';

// Importação e registo de ícones visuais
import { addIcons } from 'ionicons';
import { checkmarkOutline, chevronForwardOutline, cameraOutline, checkmarkCircleOutline, arrowForwardOutline, informationCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-registar-garantia',
  templateUrl: 'registar-garantia.page.html',
  styleUrls: ['registar-garantia.page.scss'],
  standalone: false,
})
export class RegistarGarantiaPage implements OnInit {
  
  garantiaForm: FormGroup; // Grupo principal que controla todo o formulário
  passoAtual: number = 1; // Passo do formulário (1 a 5)
  emModoEdicao: boolean = false; // Modo de edição
  modalCompraAberto: boolean = false; // Controlo do modal de data
  modalExpiracaoAberto: boolean = false; // Controlo do modal de data
  categorias: string[] = []; // Lista de categorias
  
  garantiaId: string = Date.now().toString(); // ID gerado para a garantia
  diasRestantes: number = 0; // Controlo externo ao formulário para exibição

  constructor(
    private garantiasService: GarantiasService, 
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder // Injeta o construtor de formulários
  ) {
    addIcons({ checkmarkOutline, chevronForwardOutline, cameraOutline, checkmarkCircleOutline, arrowForwardOutline, informationCircleOutline });
    
    // Constrói o formulário reativo definindo as regras de validação
    this.garantiaForm = this.fb.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      dataCompra: ['', Validators.required],
      dataExpiracao: ['', Validators.required],
      descricao: [''],
      fotoTalao: [''],
      fotoLocal: [''],
      alerta: ['1 semana antes'] // Valor por defeito
    });
  }

  async ngOnInit() {
    this.categorias = await this.garantiasService.getCategorias();
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.emModoEdicao = true;
      this.garantiaId = id; // Guarda o ID original
      const lista = await this.garantiasService.getGarantias();
      const garantiaExistente = lista.find((g: any) => g.id === id);
      
      if (garantiaExistente) {
        // Preenche o formulário automaticamente com os dados encontrados
        this.garantiaForm.patchValue(garantiaExistente);
        this.diasRestantes = garantiaExistente.diasRestantes || 0;
      }
    }
  }

  // --- NAVEGAÇÃO E LÓGICA DE DADOS ---

  avancarPasso() {
    if (this.passoAtual < 5) {
      this.passoAtual++;
      if (this.passoAtual === 5) {
        this.calcularDiasRestantes();
      }
    }
  }

  recuarPasso() {
    if (this.passoAtual > 1) {
      this.passoAtual--;
    }
  }

  calcularDiasRestantes() {
    const dataExp = this.garantiaForm.get('dataExpiracao')?.value;
    if (dataExp) {
      const data = new Date(dataExp);
      const hoje = new Date();
      const difTempo = data.getTime() - hoje.getTime();
      this.diasRestantes = Math.ceil(difTempo / (1000 * 3600 * 24));
    }
  }

  formatarData(dataIso: string): string {
    if (!dataIso) return '';
    const data = new Date(dataIso);
    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    const ano = data.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  // Atualiza programaticamente o valor do alerta no formulário
  atualizarAlerta(tipo: string) {
    this.garantiaForm.patchValue({ alerta: tipo });
  }

  async concluirRegisto() {
    // Extrai todos os dados validados do Reactive Form
    const dadosFormulario = this.garantiaForm.value;

    if (dadosFormulario.dataCompra && dadosFormulario.dataCompra.includes('T')) {
      dadosFormulario.dataCompra = dadosFormulario.dataCompra.split('T')[0];
    }
    if (dadosFormulario.dataExpiracao && dadosFormulario.dataExpiracao.includes('T')) {
      dadosFormulario.dataExpiracao = dadosFormulario.dataExpiracao.split('T')[0];
    }

    // Junta o ID e os cálculos ao objeto final a guardar
    const garantiaFinal = {
      ...dadosFormulario,
      id: this.garantiaId,
      diasRestantes: this.diasRestantes
    };

    if (this.emModoEdicao) {
      await this.garantiasService.editarGarantia(garantiaFinal);
    } else {
      await this.garantiasService.adicionarGarantia(garantiaFinal);
    }
    
    this.router.navigate(['/tabs/tab1']);
  }

  // --- LÓGICA DO UPLOAD DE FOTOS (NATIVA) ---

  async tirarFoto(tipo: 'talao' | 'local') {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, 
        source: CameraSource.Prompt
      });

      if (image.dataUrl) {
        // Atualiza a foto diretamente no controlo do formulário
        if (tipo === 'talao') this.garantiaForm.patchValue({ fotoTalao: image.dataUrl });
        if (tipo === 'local') this.garantiaForm.patchValue({ fotoLocal: image.dataUrl });
      }
    } catch (error) {
      console.log('Operação da câmara cancelada.');
    }
  }

  removerFoto(tipo: 'talao' | 'local', event: Event) {
    event.stopPropagation(); 
    if (tipo === 'talao') this.garantiaForm.patchValue({ fotoTalao: '' });
    if (tipo === 'local') this.garantiaForm.patchValue({ fotoLocal: '' });
  }
}