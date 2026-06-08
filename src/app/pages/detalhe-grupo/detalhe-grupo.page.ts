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
    // Vai buscar o email real da pessoa que iniciou sessão
    const emailLogado = localStorage.getItem('mockEmail');
    
    if (id && emailLogado) {
      // 1. PRIMEIRO PASSO: Verifica se o grupo já foi abandonado (está no histórico)
      const historico = await this.garantiasService.getGruposAntigos();
      const grupoNoHistorico = historico.find((g: any) => g.id === id);

      if (grupoNoHistorico) {
        // Se encontrou no histórico, assume imediatamente que é um grupo Antigo
        this.grupo = grupoNoHistorico;
        this.isAntigo = true;
        
        if (this.grupo.garantiasIds) {
          await this.carregarDadosDasGarantias();
        }
      } else {
        // 2. SE NÃO ESTIVER NO HISTÓRICO: Procura nos grupos ativos usando o email real
        let gruposAtuais = await this.garantiasService.getGruposRemotos(emailLogado);
        
        try {
          const res = await fetch('/assets/data/grupos.json');
          const dadosJson = await res.json();
          if (dadosJson && dadosJson.grupos) {
            gruposAtuais = [...gruposAtuais, ...dadosJson.grupos];
          }
        } catch (e) {
          console.error('Aviso: ficheiro grupos.json não encontrado.');
        }

        const grupoEncontrado = gruposAtuais.find((g: any) => g.id === id);
        
        if (grupoEncontrado) {
          this.grupo = grupoEncontrado;
          this.isAntigo = false;
          
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
            // Vai buscar o email real da pessoa que iniciou sessão
            const emailLogado = localStorage.getItem('mockEmail');
            
            if (emailLogado && this.grupo?.id) {
              
              // Processa grupos locais (JSON) movendo-os diretamente para o histórico
              if (this.grupo.id.length < 15) {
                await this.garantiasService.guardarGrupoAntigo(this.grupo);
                
                // Emite evento para forçar a atualização imediata da interface
                this.garantiasService.dadosAlterados.emit();
                
                this.router.navigateByUrl('/tabs/tab2');
              } else {
                // Remove o utilizador do grupo na base de dados remota usando o email real
                const sucesso = await this.gruposService.sairDoGrupo(this.grupo.id, emailLogado);
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