import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { GruposService } from '../../services/grupos';
import { GarantiasService } from '../../services/garantias.service';
import { addIcons } from 'ionicons';

// Ícones utilizados na interface
import { 
  logOutOutline, 
  personCircleOutline, 
  chevronForwardOutline, 
  createOutline,
  calendarOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-detalhe-grupo',
  templateUrl: './detalhe-grupo.page.html',
  styleUrls: ['./detalhe-grupo.page.scss'],
  standalone: false,
})
export class DetalheGrupoPage implements OnInit {
  
  // Informações do grupo selecionado
  grupo: any;
  
  // Lista detalhada das garantias deste grupo
  garantiasCompletas: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private gruposService: GruposService,
    private garantiasService: GarantiasService 
  ) {
    // Registo de ícones para a interface
    addIcons({ 
      logOutOutline, 
      personCircleOutline, 
      chevronForwardOutline, 
      createOutline,
      calendarOutline,
      shieldCheckmarkOutline
    });
  }

  // Mantido para compatibilidade, mas a lógica real passou para o ionViewWillEnter
  ngOnInit() {}

  /** Executado sempre que a página entra em foco (resolve problemas de cache). */
 async ionViewWillEnter() {
  const id = this.route.snapshot.paramMap.get('id');
  
  if (id) {
    console.log('A carregar dados atualizados do grupo...');
    // Força a procura do grupo novamente para vir com os novos emails
    this.grupo = await this.gruposService.getGrupo(id);
    
    if (this.grupo && this.grupo.garantiasIds) {
      await this.carregarDadosDasGarantias();
    }
  }
}
  /** Cruza os IDs do grupo com as garantias locais para mostrar os detalhes. */
  async carregarDadosDasGarantias() {
    const todasGarantias = await this.garantiasService.getGarantias();
    
    // Filtra apenas as garantias que pertencem a este grupo
    this.garantiasCompletas = todasGarantias.filter((g: { id: any; }) => 
      this.grupo.garantiasIds.includes(g.id)
    );
  }

  /** Abre o formulário de criação em modo de edição usando o ID atual. */
  editar() {
    if (this.grupo && this.grupo.id) {
      this.router.navigate(['/criar-grupo', this.grupo.id]);
    }
  }

  /** Remove o utilizador do grupo após confirmação visual. */
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
              // Remove o email do utilizador da lista de membros remota
              const sucesso = await this.gruposService.sairDoGrupo(this.grupo.id, perfil.email);
              
              // Se removido com sucesso, volta para a lista de grupos
              if (sucesso) {
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