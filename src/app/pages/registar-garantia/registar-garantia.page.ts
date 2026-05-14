// registar-garantia.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { GarantiasService } from '../../services/garantias.service';

@Component({
  selector: 'app-registar-garantia',
  templateUrl: './registar-garantia.page.html',
  styleUrls: ['./registar-garantia.page.scss'],
  standalone: false
})
export class RegistarGarantiaPage {
  // Controlo do wizard (passo atual do formulário)
  passoAtual: number = 1;

  // Estrutura de dados temporária para guardar a garantia antes de a enviar
  novaGarantia = {
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

  constructor(private garantiasService: GarantiasService, private router: Router) {}

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
        source: CameraSource.Prompt // Pergunta ao utilizador se quer usar a câmara ou a galeria
      });

      // Atribui a foto à variável correta consoante o passo em que estamos
      if (image.dataUrl) {
        if (tipo === 'talao') this.novaGarantia.fotoTalao = image.dataUrl;
        if (tipo === 'local') this.novaGarantia.fotoLocal = image.dataUrl;
      }
    } catch (error) {
      // Impede que a app "crashe" caso o utilizador feche a câmara sem tirar foto
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

  // Guarda os dados no serviço e redireciona para a página principal
  async concluirRegisto() {
    await this.garantiasService.adicionarGarantia(this.novaGarantia);
    this.router.navigate(['/tabs/tab1']);
  }
}