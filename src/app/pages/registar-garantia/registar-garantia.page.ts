// Importações dos módulos centrais do Angular e serviços de navegação
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 

// Importação do plugin nativo para captura e seleção de imagens
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { GarantiasService } from '../../services/garantias.service';

// Importação e registo de ícones visuais para a interface
import { addIcons } from 'ionicons';
import { checkmarkOutline, chevronForwardOutline, cameraOutline, checkmarkCircleOutline, arrowForwardOutline } from 'ionicons/icons';

// Componente responsável pelo formulário de registo e edição de garantias
@Component({
  selector: 'app-registar-garantia',
  templateUrl: 'registar-garantia.page.html',
  styleUrls: ['registar-garantia.page.scss'],
  standalone: false,
})
export class RegistarGarantiaPage implements OnInit {
  
  // Controla o passo atualmente visível no formulário (varia entre 1 e 5)
  passoAtual: number = 1;
  
  // Sinalizador que define se o formulário opera em modo de edição ou de criação
  emModoEdicao: boolean = false; 

  // Objeto que armazena todos os dados inseridos pelo utilizador no formulário
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

  // Inicializa os serviços de dados e navegação, registando os ícones necessários
  constructor(
    private garantiasService: GarantiasService, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Regista os ícones visuais para utilização na estrutura HTML desta página
    addIcons({ checkmarkOutline, chevronForwardOutline, cameraOutline, checkmarkCircleOutline, arrowForwardOutline });
  }

  // Executado na inicialização: verifica a existência de um ID de rota para ativar o modo de edição
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.emModoEdicao = true;
      const lista = await this.garantiasService.getGarantias();
      const garantiaExistente = lista.find((g: any) => g.id === id);
      
      // Preenche o formulário com os dados da garantia localizada
      if (garantiaExistente) {
        this.novaGarantia = { ...garantiaExistente };
      }
    }
  }

  // --- NAVEGAÇÃO E LÓGICA DE DADOS ---

  // Incrementa o passo do formulário e calcula os dias restantes ao atingir o último passo
  avancarPasso() {
    if (this.passoAtual < 5) {
      this.passoAtual++;
      if (this.passoAtual === 5) {
        this.calcularDiasRestantes();
      }
    }
  }

  // Decrementa a variável de controlo para regressar ao passo anterior do formulário
  recuarPasso() {
    if (this.passoAtual > 1) {
      this.passoAtual--;
    }
  }

  // Calcula a diferença matemática em dias entre a data de expiração selecionada e a data atual
  calcularDiasRestantes() {
    if (this.novaGarantia.dataExpiracao) {
      const dataExp = new Date(this.novaGarantia.dataExpiracao);
      const hoje = new Date();
      const difTempo = dataExp.getTime() - hoje.getTime();
      this.novaGarantia.diasRestantes = Math.ceil(difTempo / (1000 * 3600 * 24));
    }
  }

  // Grava o registo remotamente e localmente, redirecionando para a listagem principal após conclusão
  async concluirRegisto() {
    if (this.emModoEdicao) {
      await this.garantiasService.editarGarantia(this.novaGarantia);
    } else {
      await this.garantiasService.adicionarGarantia(this.novaGarantia);
    }
    this.router.navigate(['/tabs/tab1']);
  }

  // --- LÓGICA DO UPLOAD DE FOTOS (NATIVA) ---

  // Abre a interface nativa do dispositivo para capturar uma fotografia ou escolher da galeria
  async tirarFoto(tipo: 'talao' | 'local') {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, 
        source: CameraSource.Prompt // Pergunta ao utilizador se pretende usar a Câmara ou a Galeria
      });

      // Associa os dados da imagem capturada ao respetivo campo da garantia
      if (image.dataUrl) {
        if (tipo === 'talao') this.novaGarantia.fotoTalao = image.dataUrl;
        if (tipo === 'local') this.novaGarantia.fotoLocal = image.dataUrl;
      }
    } catch (error) {
      console.log('Operação da câmara cancelada.');
    }
  }

  // Apaga a fotografia selecionada e anula a propagação do evento de clique para não reabrir a câmara
  removerFoto(tipo: 'talao' | 'local', event: Event) {
    event.stopPropagation(); 
    if (tipo === 'talao') this.novaGarantia.fotoTalao = '';
    if (tipo === 'local') this.novaGarantia.fotoLocal = '';
  }
}