import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GarantiasService } from '../../services/garantias';
import { AlertController } from '@ionic/angular';

// Importações corretas para Standalone
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-garantia-detalhe',
  templateUrl: './garantia-detalhe.page.html',
  standalone: false,
 
})
export class GarantiaDetalhePage implements OnInit {
  garantia: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private garantiasService: GarantiasService
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const lista = await this.garantiasService.getGarantias();
      this.garantia = lista.find((g: any) => g.id === id);
    }
  }

  async eliminar() {
    const alert = await this.alertController.create({
      header: 'Deseja mesmo eliminar esta garantia?',
      buttons: [
        { text: 'Não', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Sim',
          handler: async () => {
            await this.garantiasService.removerGarantia(this.garantia.id);
            this.router.navigate(['/tabs/tab1']);
          }
        }
      ]
    });
    await alert.present();
  }

  editar() { 
    console.log('Método editar acionado.'); 
  }
}