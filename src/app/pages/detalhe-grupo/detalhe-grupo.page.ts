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

// Componente responsável por apresentar a informação detalhada de um grupo e as suas garantias
@Component({
  selector: 'app-detalhe-grupo',
  templateUrl: './detalhe-grupo.page.html',
  styleUrls: ['./detalhe-grupo.page.scss'],
  standalone: false,
})
export class DetalheGrupoPage implements OnInit {
  
  // Objeto que armazena a informação completa do grupo selecionado
  grupo: any;
  
  // Array que guarda os dados detalhados das garantias associadas ao grupo
  garantiasCompletas: any[] = [];
  
  // Sinalizador booleano que indica se o grupo pertence ao histórico de grupos arquivados
  isAntigo: boolean = false;
  
  // Inicializa os serviços de roteamento, interface e dados, registando os ícones necessários
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private gruposService: GruposService,
    private garantiasService: GarantiasService
  ) {
    // Regista os ícones visuais para utilização na estrutura HTML
    addIcons({
      logOutOutline, personCircleOutline, chevronForwardOutline,
      createOutline, calendarOutline, shieldCheckmarkOutline,
      trashOutline, informationCircleOutline
    });
  }

  // Método do ciclo de vida do Angular executado na inicialização do componente
  ngOnInit() { }

  // Executado ao entrar na página. Carrega os dados do grupo e as respetivas garantias
  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      const perfil = await this.garantiasService.getPerfil();
      
      if (perfil) {
        // Obtém a lista de grupos armazenados na base de dados remota (Firebase)
        let gruposAtuais = await this.garantiasService.getGruposRemotos(perfil.email);
        
        // Adiciona os grupos de teste locais à lista de grupos ativos
        try {
          const res = await fetch('/assets/data/grupos.json');
          const dadosJson = await res.json();
          if (dadosJson && dadosJson.grupos) {
            gruposAtuais = [...gruposAtuais, ...dadosJson.grupos];
          }
        } catch (e) {
          console.error('Aviso: ficheiro grupos.json não encontrado.');
        }

        // Procura o ID do grupo na lista combinada de grupos ativos
        let grupoEncontrado = gruposAtuais.find((g: any) => g.id === id);
        
        // Se não existir nos ativos, verifica o histórico de grupos arquivados/apagados
        if (!grupoEncontrado) {
          const historico = await this.garantiasService.getGruposAntigos();
          grupoEncontrado = historico.find((g: any) => g.id === id);
          this.isAntigo = true;
        } else {
          this.isAntigo = false;
        }

        // Se o grupo for localizado, preenche a variável principal e carrega as garantias
        if (grupoEncontrado) {
          this.grupo = grupoEncontrado;
          
          if (this.grupo.garantiasIds) {
            await this.carregarDadosDasGarantias();
          }
        }
      }
    }
  }

  // Filtra o catálogo geral de garantias para extrair apenas as associadas ao grupo atual
  async carregarDadosDasGarantias() {
    const todasGarantias = await this.garantiasService.getGarantias();
    
    this.garantiasCompletas = todasGarantias.filter((g: { id: any; }) =>
      this.grupo.garantiasIds.includes(g.id)
    );
  }

  // Navega para a página de edição do grupo atual, enviando o respetivo ID
  editar() {
    if (this.grupo && this.grupo.id) {
      this.router.navigate(['/criar-grupo', this.grupo.id]);
    }
  }
  
  // Apresenta um menu de confirmação para sair do grupo e processa o respetivo arquivamento
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
              
              // Processa grupos locais (JSON) movendo-os diretamente para o histórico
              if (this.grupo.id.length < 15) {
                await this.garantiasService.guardarGrupoAntigo(this.grupo);
                
                // Emite evento para forçar a atualização imediata da interface
                this.garantiasService.dadosAlterados.emit();
                
                this.router.navigateByUrl('/tabs/tab2');
              } else {
                // Remove o utilizador do grupo na base de dados remota (Firebase)
                const sucesso = await this.gruposService.sairDoGrupo(this.grupo.id, perfil.email);
                if (sucesso) {
                  await this.garantiasService.guardarGrupoAntigo(this.grupo);
                  
                  // Emite evento para forçar a atualização imediata da interface
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