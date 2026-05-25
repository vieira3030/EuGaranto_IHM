import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  trashOutline, 
  informationCircleOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-detalhe-grupo',
  templateUrl: './detalhe-grupo.page.html',
  styleUrls: ['./detalhe-grupo.page.scss'],
  standalone: false,
})
export class DetalheGrupoPage implements OnInit {
  
  grupo: any; // Guarda os dados do grupo atual
  garantiasCompletas: any[] = []; // Lista as garantias associadas ao grupo
  isAntigo: boolean = false; // Controla se o grupo pertence ao histórico local
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actionSheetCtrl: ActionSheetController, 
    private gruposService: GruposService,
    private garantiasService: GarantiasService 
  ) {
    // Regista os ícones usados na interface
    addIcons({ 
      logOutOutline, 
      personCircleOutline, 
      chevronForwardOutline, 
      createOutline,
      calendarOutline,
      shieldCheckmarkOutline,
      trashOutline,
      informationCircleOutline
    });
  }

  ngOnInit() {}

  // Carrega os dados sempre que a página fica ativa
  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      const perfil = await this.garantiasService.getPerfil();
      
      if (perfil) {
        // 1. Tenta encontrar o grupo nos ativos (Firebase)
        const gruposAtuais = await this.garantiasService.getGruposRemotos(perfil.email);
        let grupoEncontrado = gruposAtuais.find(g => g.id === id);
        
        // 2. Se não encontrou, procura nos arquivados (Ionic Storage)
        if (!grupoEncontrado) {
          const historico = await this.garantiasService.getGruposAntigos();
          grupoEncontrado = historico.find((g: any) => g.id === id);
          this.isAntigo = true; 
        } else {
          this.isAntigo = false; 
        }

        // 3. Se o grupo existe, carrega as informações
        if (grupoEncontrado) {
          this.grupo = grupoEncontrado;
          
          if (this.grupo.garantiasIds) {
            await this.carregarDadosDasGarantias();
          }
        }
      }
    }
  }

  // Filtra e carrega os detalhes das garantias partilhadas no grupo
  async carregarDadosDasGarantias() {
    const todasGarantias = await this.garantiasService.getGarantias();
    
    this.garantiasCompletas = todasGarantias.filter((g: { id: any; }) => 
      this.grupo.garantiasIds.includes(g.id)
    );
  }

  // Navega para o ecrã de edição do grupo
  editar() {
    if (this.grupo && this.grupo.id) {
      this.router.navigate(['/criar-grupo', this.grupo.id]);
    }
  }

  // Abre confirmação para sair do grupo e guarda-o no histórico do Ionic Storage
  async sairDoGrupo() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Sair do Grupo',
      subHeader: 'Tens a certeza que queres deixar este grupo? Perderás o acesso às garantias partilhadas.',
      buttons: [
        {
          text: 'Sair do Grupo',
          role: 'destructive',
          icon: 'log-out-outline',
          handler: async () => {
            const perfil = await this.garantiasService.getPerfil();
            
            if (perfil && this.grupo?.id) {
              const sucesso = await this.gruposService.sairDoGrupo(this.grupo.id, perfil.email);
              
              if (sucesso) {
                // Guarda o grupo arquivado através do serviço e redireciona
                await this.garantiasService.guardarGrupoAntigo(this.grupo);
                this.router.navigateByUrl('/tabs/tab2');
              }
            }
          }
        },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });

    await actionSheet.present();
  }
}