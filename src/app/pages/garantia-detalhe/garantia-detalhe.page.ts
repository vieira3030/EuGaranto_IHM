import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GarantiasService } from '../../services/garantias.service';
import { AlertController } from '@ionic/angular';

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

  // Carrega os dados da garantia ao abrir a página
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const lista = await this.garantiasService.getGarantias();
      this.garantia = lista.find((g: any) => g.id === id);
    }
  }

  // Mostra aviso e elimina a garantia se o utilizador confirmar
  async eliminar() {
    const alert = await this.alertController.create({
      header: 'Deseja mesmo eliminar esta garantia?',
      buttons: [
        { text: 'Não', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Sim',
          handler: async () => {
            await this.garantiasService.removerGarantia(this.garantia.id);
            this.router.navigate(['/tabs/tab1']); // Volta à lista principal
          }
        }
      ]
    });
    await alert.present();
  }

  // Navega para a página de registo enviando o ID para modo de edição
  editar() { 
    if (this.garantia && this.garantia.id) {
      this.router.navigate(['/registar-garantia', this.garantia.id]);
    }
  }
}