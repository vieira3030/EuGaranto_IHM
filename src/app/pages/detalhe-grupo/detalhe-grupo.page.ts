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
  
  // Variável para guardar toda a informação do grupo selecionado
  grupo: any;
  // Lista que armazena os detalhes visuais de cada garantia deste grupo
  garantiasCompletas: any[] = [];
  // Identifica se o grupo atual é apenas um registo de histórico
  isAntigo: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private gruposService: GruposService,
    private garantiasService: GarantiasService
  ) {
    // Carrega os ícones visuais para utilização no HTML
    addIcons({
      logOutOutline, personCircleOutline, chevronForwardOutline,
      createOutline, calendarOutline, shieldCheckmarkOutline,
      trashOutline, informationCircleOutline
    });
  }

  ngOnInit() { }

  // Busca e carrega os dados do grupo sempre que o utilizador entra no ecrã
  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      const perfil = await this.garantiasService.getPerfil();
      
      if (perfil) {
        // 1. Obtém os grupos da nuvem (Firebase)
        let gruposAtuais = await this.garantiasService.getGruposRemotos(perfil.email);
        
        // 2. Lê os grupos de teste do ficheiro JSON para garantir que aparecem
        try {
          const res = await fetch('/assets/data/grupos.json');
          const dadosJson = await res.json();
          if (dadosJson && dadosJson.grupos) {
            gruposAtuais = [...gruposAtuais, ...dadosJson.grupos];
          }
        } catch (e) {
          console.error('Aviso: ficheiro grupos.json não encontrado.');
        }

        // 3. Procura o ID do grupo na lista de grupos ativos
        let grupoEncontrado = gruposAtuais.find((g: any) => g.id === id);
        
        // 4. Se não encontrar nos ativos, procura no histórico de grupos apagados
        if (!grupoEncontrado) {
          const historico = await this.garantiasService.getGruposAntigos();
          grupoEncontrado = historico.find((g: any) => g.id === id);
          this.isAntigo = true;
        } else {
          this.isAntigo = false;
        }

        // 5. Preenche as variáveis do ecrã se o grupo existir
        if (grupoEncontrado) {
          this.grupo = grupoEncontrado;
          
          if (this.grupo.garantiasIds) {
            await this.carregarDadosDasGarantias();
          }
        }
      }
    }
  }

  // Compara os IDs guardados no grupo com a lista geral para mostrar as garantias
  async carregarDadosDasGarantias() {
    const todasGarantias = await this.garantiasService.getGarantias();
    
    this.garantiasCompletas = todasGarantias.filter((g: { id: any; }) =>
      this.grupo.garantiasIds.includes(g.id)
    );
  }

  // Redireciona para o formulário de edição mantendo o ID atual
  editar() {
    if (this.grupo && this.grupo.id) {
      this.router.navigate(['/criar-grupo', this.grupo.id]);
    }
  }

  
  // Pede confirmação e move o grupo atual para a lista de antigos no armazenamento
  
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
              
              // Se for um grupo de teste (ID pequeno do JSON), arquiva logo sem ir ao Firebase
              if (this.grupo.id.length < 15) {
                await this.garantiasService.guardarGrupoAntigo(this.grupo);
                
                // Emite o aviso de alteração ANTES de mudar de ecrã
                this.garantiasService.dadosAlterados.emit();
                
                this.router.navigateByUrl('/tabs/tab2');
              } else {
                // Se for um grupo real, avisa a nuvem (Firebase) primeiro
                const sucesso = await this.gruposService.sairDoGrupo(this.grupo.id, perfil.email);
                if (sucesso) {
                  await this.garantiasService.guardarGrupoAntigo(this.grupo);
                  
                  // Emite o aviso de alteração ANTES de mudar de ecrã
                  this.garantiasService.dadosAlterados.emit();
                  
                  this.router.navigateByUrl('/tabs/tab2');
                }
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