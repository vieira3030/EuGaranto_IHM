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
  trashOutline, // Ícone para usar no ActionSheet (opcional, mas fica bem)
  informationCircleOutline // Ícone para o aviso de grupo arquivado
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
  
  // Variável para saber se estamos a ver um grupo do histórico
  isAntigo: boolean = false; 
  
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
      trashOutline,
      informationCircleOutline
    });
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      const perfil = await this.garantiasService.getPerfil();
      
      if (perfil) {
        // 1. Tenta encontrar o grupo nos ativos (Firebase)
        const gruposAtuais = await this.garantiasService.getGruposRemotos(perfil.email);
        let grupoEncontrado = gruposAtuais.find(g => g.id === id);
        
        // 2. Se não encontrou, procura nos arquivados (Memória local)
        if (!grupoEncontrado) {
          const historico = JSON.parse(localStorage.getItem('gruposAntigos') || '[]');
          grupoEncontrado = historico.find((g: any) => g.id === id);
          this.isAntigo = true; // Ativa o modo de histórico
        } else {
          this.isAntigo = false; // Garante que volta a false se for um grupo ativo
        }

        // 3. Se o grupo existe (seja onde for), carrega as informações
        if (grupoEncontrado) {
          this.grupo = grupoEncontrado;
          
          if (this.grupo.garantiasIds) {
            await this.carregarDadosDasGarantias();
          }
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
          role: 'destructive',
          icon: 'log-out-outline',
          handler: async () => {
            const perfil = await this.garantiasService.getPerfil();
            
            if (perfil && this.grupo?.id) {
              const sucesso = await this.gruposService.sairDoGrupo(this.grupo.id, perfil.email);
              
              if (sucesso) {
                // --- NOVA LÓGICA: Guardar o grupo no histórico local ---
                const historico = JSON.parse(localStorage.getItem('gruposAntigos') || '[]');
                // Se o grupo ainda não estiver no histórico, adicionamos a cópia dele
                if (!historico.find((g: any) => g.id === this.grupo.id)) {
                  historico.push(this.grupo);
                  localStorage.setItem('gruposAntigos', JSON.stringify(historico));
                }
                // -------------------------------------------------------

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