import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { GarantiasService } from '../../services/garantias';

// Importações necessárias para a arquitetura Standalone Components
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registar-garantia',
  templateUrl: './registar-garantia.page.html',
  styleUrls: ['./registar-garantia.page.scss'],
  standalone: true, // Tem de estar a true nesta arquitetura
  imports: [IonicModule, CommonModule, FormsModule] // Importação explícita dos módulos exigidos pelo HTML
})
export class RegistarGarantiaPage {
  
  /** Controlador de estado para o progresso do formulário (1 a 5). */
  passoAtual: number = 1;

  /** Objeto de dados para armazenamento temporário das propriedades da garantia. */
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

  constructor(
    private garantiasService: GarantiasService,
    private router: Router
  ) {}

  /** Incrementa o estado do formulário para avançar na interface. */
  avancarPasso() {
    if (this.passoAtual < 5) {
      this.passoAtual++;
      if (this.passoAtual === 5) {
        this.calcularDiasRestantes();
      }
    }
  }

  /** Decrementa o estado do formulário para regressar ao ecrã anterior. */
  recuarPasso() {
    if (this.passoAtual > 1) {
      this.passoAtual--;
    }
  }

  /** Define a periodicidade de notificação. */
  setAlerta(alerta: string) {
    this.novaGarantia.alerta = alerta;
  }

  /** 
   * Invoca a API nativa da câmara via Capacitor para captura de imagem.
   * O parâmetro define se a imagem se destina ao talão ou ao local físico.
   */
  async tirarFoto(tipo: 'talao' | 'local') {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt // Permite escolher entre Câmara e Galeria
    });

    if (image.dataUrl) {
      if (tipo === 'talao') this.novaGarantia.fotoTalao = image.dataUrl;
      if (tipo === 'local') this.novaGarantia.fotoLocal = image.dataUrl;
    }
  }

  /** Calcula de forma simplificada a diferença em dias até à expiração. */
  calcularDiasRestantes() {
    if (this.novaGarantia.dataExpiracao) {
      const dataExp = new Date(this.novaGarantia.dataExpiracao);
      const hoje = new Date();
      const difTempo = dataExp.getTime() - hoje.getTime();
      this.novaGarantia.diasRestantes = Math.ceil(difTempo / (1000 * 3600 * 24));
    }
  }

  /** 
   * Executa a inserção do objeto no Ionic Storage através do serviço 
   * e redireciona o utilizador para a listagem principal.
   */
  async concluirRegisto() {
    await this.garantiasService.adicionarGarantia(this.novaGarantia);
    this.router.navigate(['/tabs/tab1']);
  }
}