import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 

// Plugin nativo da Câmara 
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { GarantiasService } from '../../services/garantias.service';

// Registo de ícones para o novo design (Adicionada a arrowForwardOutline)
import { addIcons } from 'ionicons';
import { checkmarkOutline, chevronForwardOutline, cameraOutline, checkmarkCircleOutline, arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-registar-garantia',
  templateUrl: 'registar-garantia.page.html',
  styleUrls: ['registar-garantia.page.scss'],
  standalone: false,
})
export class RegistarGarantiaPage implements OnInit {
  
  passoAtual: number = 1;
  emModoEdicao: boolean = false; 

  // Estrutura de dados onde guardamos tudo o que o utilizador preenche
  novaGarantia: any = {
    id: Date.now().toString(),
    nome: '',
    dataCompra: '',
    dataExpiracao: '',
    descricao: '',
    fotoTalao: '',
    fotoLocal: '',
    alerta: '1 semana antes',
    diasRestantes: 0
  };

  constructor(
    private garantiasService: GarantiasService, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Registo de todos os ícones necessários no HTML
    addIcons({ checkmarkOutline, chevronForwardOutline, cameraOutline, checkmarkCircleOutline, arrowForwardOutline });
  }

  // Verifica se estamos a editar uma garantia existente ao iniciar a página
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.emModoEdicao = true;
      const lista = await this.garantiasService.getGarantias();
      const garantiaExistente = lista.find((g: any) => g.id === id);
      
      if (garantiaExistente) {
        this.novaGarantia = { ...garantiaExistente };
      }
    }
  }

  // --- NAVEGAÇÃO E LÓGICA DE DADOS ---

  // Avança para o próximo passo e calcula os dias no passo final
  avancarPasso() {
    if (this.passoAtual < 5) {
      this.passoAtual++;
      if (this.passoAtual === 5) {
        this.calcularDiasRestantes();
      }
    }
  }

  // Recua para o passo anterior
  recuarPasso() {
    if (this.passoAtual > 1) {
      this.passoAtual--;
    }
  }

  // Calcula matematicamente os dias restantes com base na data de expiração
  calcularDiasRestantes() {
    if (this.novaGarantia.dataExpiracao) {
      const dataExp = new Date(this.novaGarantia.dataExpiracao);
      const hoje = new Date();
      const difTempo = dataExp.getTime() - hoje.getTime();
      this.novaGarantia.diasRestantes = Math.ceil(difTempo / (1000 * 3600 * 24));
    }
  }

  // Conclui o registo, guarda na base de dados e volta à página inicial
  async concluirRegisto() {
    if (this.emModoEdicao) {
      await this.garantiasService.editarGarantia(this.novaGarantia);
    } else {
      await this.garantiasService.adicionarGarantia(this.novaGarantia);
    }
    this.router.navigate(['/tabs/tab1']);
  }

  // --- LÓGICA DO UPLOAD DE FOTOS (NATIVA) ---

  // Aciona a câmara ou a galeria do telemóvel
  async tirarFoto(tipo: 'talao' | 'local') {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, 
        source: CameraSource.Prompt // Pergunta ao utilizador se quer Câmara ou Galeria
      });

      if (image.dataUrl) {
        if (tipo === 'talao') this.novaGarantia.fotoTalao = image.dataUrl;
        if (tipo === 'local') this.novaGarantia.fotoLocal = image.dataUrl;
      }
    } catch (error) {
      console.log('Operação da câmara cancelada.');
    }
  }

  // Remove a foto guardada e impede que a câmara abra acidentalmente
  removerFoto(tipo: 'talao' | 'local', event: Event) {
    event.stopPropagation(); 
    if (tipo === 'talao') this.novaGarantia.fotoTalao = '';
    if (tipo === 'local') this.novaGarantia.fotoLocal = '';
  }
}