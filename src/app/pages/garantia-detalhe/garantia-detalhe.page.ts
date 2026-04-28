import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GarantiasService } from '../../services/garantias';

@Component({
  selector: 'app-garantia-detalhe',
  templateUrl: './garantia-detalhe.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class GarantiaDetalhePage implements OnInit {
  garantia: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private garantiasService: GarantiasService
  ) { }

  /** Método executado na inicialização do componente para carregar os detalhes do produto pelo ID. */
  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const lista = await this.garantiasService.getGarantias();
      this.garantia = lista.find((g: any) => g.id === id);
    }
  }

  /** Apresenta um alerta de confirmação e procede com a eliminação do registo caso o utilizador confirme. */
  async eliminar() {
    const alert = await this.alertController.create({
      header: 'Deseja mesmo eliminar esta garantia?',
      buttons: [
        { text: 'Não', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Sim',
          handler: async () => {
            await this.garantiasService.removerGarantia(this.garantia.id);
            this.router.navigate(['/tabs/tab1']); // Redireciona para o ecrã de listagem
          }
        }
      ]
    });
    await alert.present();
  }

  /** Método reservado para futura implementação da funcionalidade de edição. */
  editar() { 
    console.log('Método editar acionado.'); 
  }
}