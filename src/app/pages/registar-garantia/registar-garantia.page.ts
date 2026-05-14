import { Component, OnInit } from '@angular/core'; // Adicionado OnInit
import { Router, ActivatedRoute } from '@angular/router'; // Adicionado ActivatedRoute
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { GarantiasService } from '../../services/garantias.service';

@Component({
  selector: 'app-registar-garantia',
  templateUrl: './registar-garantia.page.html',
  styleUrls: ['./registar-garantia.page.scss'],
  standalone: false
})
export class RegistarGarantiaPage implements OnInit { // Implementa o OnInit
  // Controlo do wizard (passo atual do formulário)
  passoAtual: number = 1;

  // Variável para sabermos se estamos a editar ou a criar de raiz
  emModoEdicao: boolean = false; 

  // Estrutura de dados temporária (tem os valores por defeito para uma nova)
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
    private route: ActivatedRoute // Necessário para ler o ID que vem no URL
  ) {}

  // É executado logo que a página abre
  async ngOnInit() {
    // Tenta apanhar o ID que enviámos a partir do botão "Editar"
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.emModoEdicao = true; // Avisa a app que é uma edição
      const lista = await this.garantiasService.getGarantias();
      const garantiaExistente = lista.find((g: any) => g.id === id);
      
      if (garantiaExistente) {
        // Copia os dados da garantia guardada para o nosso formulário
        this.novaGarantia = { ...garantiaExistente };
      }
    }
  }

  // Avança para o ecrã seguinte e calcula os dias no último passo
  avancarPasso() {
    if (this.passoAtual < 5) {
      this.passoAtual++;
      if (this.passoAtual === 5) {
        this.calcularDiasRestantes();
      }
    }
  }

  // Recua para o ecrã anterior do formulário
  recuarPasso() {
    if (this.passoAtual > 1) {
      this.passoAtual--;
    }
  }

  // Atualiza o alerta selecionado pelo utilizador
  setAlerta(alerta: string) {
    this.novaGarantia.alerta = alerta;
  }

  // Aciona a câmara nativa e guarda a foto em formato Base64 (DataUrl)
  async tirarFoto(tipo: 'talao' | 'local') {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, 
        source: CameraSource.Prompt
      });

      if (image.dataUrl) {
        if (tipo === 'talao') this.novaGarantia.fotoTalao = image.dataUrl;
        if (tipo === 'local') this.novaGarantia.fotoLocal = image.dataUrl;
      }
    } catch (error) {
      console.log('Câmara cancelada pelo utilizador.');
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

  // Guarda os dados e redireciona para a página principal
  async concluirRegisto() {
    if (this.emModoEdicao) {
      // Se for edição, chama a função de editar
      await this.garantiasService.editarGarantia(this.novaGarantia);
    } else {
      // Se for nova, chama a função de adicionar
      await this.garantiasService.adicionarGarantia(this.novaGarantia);
    }
    this.router.navigate(['/tabs/tab1']);
  }
}