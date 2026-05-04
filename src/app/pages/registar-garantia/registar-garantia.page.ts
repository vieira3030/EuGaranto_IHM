import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { GarantiasService } from '../../services/garantias';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importações corretas para Standalone
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonFooter } from '@ionic/angular/standalone';

@Component({
  selector: 'app-registar-garantia',
  templateUrl: './registar-garantia.page.html',
  styleUrls: ['./registar-garantia.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonFooter]
})
export class RegistarGarantiaPage {
  passoAtual: number = 1;

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

  setAlerta(alerta: string) {
    this.novaGarantia.alerta = alerta;
  }

  async tirarFoto(tipo: 'talao' | 'local') {
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
  }

  calcularDiasRestantes() {
    if (this.novaGarantia.dataExpiracao) {
      const dataExp = new Date(this.novaGarantia.dataExpiracao);
      const hoje = new Date();
      const difTempo = dataExp.getTime() - hoje.getTime();
      this.novaGarantia.diasRestantes = Math.ceil(difTempo / (1000 * 3600 * 24));
    }
  }

  async concluirRegisto() {
    await this.garantiasService.adicionarGarantia(this.novaGarantia);
    this.router.navigate(['/tabs/tab1']);
  }
}