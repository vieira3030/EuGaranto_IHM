import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// 1. IMPORTANTE: Substituir AlertController por ActionSheetController
import { ActionSheetController } from '@ionic/angular'; 

import { GruposService } from '../../services/grupos';
import { GarantiasService } from '../../services/garantias.service';
import { addIcons } from 'ionicons';

import { 
  logOutOutline, 
  personCircleOutline, 
  chevronForwardOutline, 
  createOutline,
  calendarOutline,
  shieldCheckmarkOutline,
  trashOutline // Ícone para usar no ActionSheet (opcional, mas fica bem)
} from 'ionicons/icons';

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
    // 2. IMPORTANTE: Injetar o ActionSheetController no constructor
    private actionSheetCtrl: ActionSheetController, 
    private gruposService: GruposService,
    private garantiasService: GarantiasService 
  ) {
    addIcons({ 
      logOutOutline, 
      personCircleOutline, 
      chevronForwardOutline, 
      createOutline,
      calendarOutline,
      shieldCheckmarkOutline,
      trashOutline
    });
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      const perfil = await this.garantiasService.getPerfil();
      
      if (perfil) {
        const gruposAtualizados = await this.garantiasService.getGruposRemotos(perfil.email);
        this.grupo = gruposAtualizados.find(g => g.id === id);
        
        if (this.grupo && this.grupo.garantiasIds) {
          await this.carregarDadosDasGarantias();
        }
      }
    }
  }

  async carregarDadosDasGarantias() {
    const todasGarantias = await this.garantiasService.getGarantias();
    
    this.garantiasCompletas = todasGarantias.filter((g: { id: any; }) => 
      this.grupo.garantiasIds.includes(g.id)
    );
  }

  editar() {
    if (this.grupo && this.grupo.id) {
      this.router.navigate(['/criar-grupo', this.grupo.id]);
    }
  }

  // 3. IMPORTANTE: Nova lógica para sair do grupo usando a janela de baixo
  async sairDoGrupo() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Sair do Grupo',
      subHeader: 'Tens a certeza que queres deixar este grupo? Perderás o acesso às garantias partilhadas.',
      buttons: [
        {
          text: 'Sair do Grupo',
          role: 'destructive', // Faz com que o texto fique vermelho
          icon: 'log-out-outline',
          handler: async () => {
            const perfil = await this.garantiasService.getPerfil();
            
            if (perfil && this.grupo?.id) {
              const sucesso = await this.gruposService.sairDoGrupo(this.grupo.id, perfil.email);
              
              if (sucesso) {
                this.router.navigateByUrl('/tabs/tab2');
              }
            }
          }
        },
        { 
          text: 'Cancelar', 
          role: 'cancel' 
        }
      ]
    });

    await actionSheet.present();
  }
}