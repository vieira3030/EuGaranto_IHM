import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Router para navegação
import { AlertController } from '@ionic/angular'; // AlertController para confirmação
import { GruposService } from '../../services/grupos';
import { GarantiasService } from '../../services/garantias.service';
import { addIcons } from 'ionicons';
import { logOutOutline, personCircleOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-detalhe-grupo',
  templateUrl: './detalhe-grupo.page.html',
  styleUrls: ['./detalhe-grupo.page.scss'],
  standalone: false,
})
export class DetalheGrupoPage implements OnInit {
  grupo: any;
  garantiasCompletas: any[] = [];
  
constructor(
  private route: ActivatedRoute,
  private router: Router,
  private alertController: AlertController,
  private gruposService: GruposService,
  private garantiasService: GarantiasService 
) {
  // Adiciona esta linha para registar os ícones que estás a usar no HTML
  addIcons({ logOutOutline, personCircleOutline, chevronForwardOutline });
}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.grupo = await this.gruposService.getGrupo(id);
      
      if (this.grupo && this.grupo.garantiasIds) {
        await this.carregarDadosDasGarantias();
      }
    }
  }

  // Vai buscar os dados completos das garantias partilhadas
  async carregarDadosDasGarantias() {
    const todasGarantias = await this.garantiasService.getGarantias();
    this.garantiasCompletas = todasGarantias.filter((g: { id: any; }) => 
      this.grupo.garantiasIds.includes(g.id)
    );
  }

  /** --- FUNCIONALIDADE DE SAÍDA --- **/

  // Exibe um aviso e, se confirmado, remove o utilizador do grupo
  async sairDoGrupo() {
    const alert = await this.alertController.create({
      header: 'Sair do Grupo',
      message: 'Tens a certeza que queres deixar este grupo?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sair',
          handler: async () => {
            const perfil = await this.garantiasService.getPerfil();
            
            if (perfil && this.grupo?.id) {
              // Chama o serviço para remover o email do Firebase e Storage
              const sucesso = await this.gruposService.sairDoGrupo(this.grupo.id, perfil.email);
              
              if (sucesso) {
                // Redireciona para a lista de grupos (Tab 2)
                this.router.navigateByUrl('/tabs/tab2');
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }
}