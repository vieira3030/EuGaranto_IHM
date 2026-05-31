// Importações nucleares do Angular para a gestão do componente e do ciclo de vida
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'; 

// Importação do serviço de gestão de dados e da interface estrutural do grupo
import { GarantiasService, Grupo } from '../services/garantias.service';

// Necessário para gerir a memória do fluxo de dados assíncrono
import { Subscription } from 'rxjs'; 

// Importação e registo dos ícones visuais nativos da biblioteca Ionic
import { addIcons } from 'ionicons';
// Adicionado o timeOutline para o filtro de grupos antigos
import { peopleOutline, chevronForwardOutline, addCircleOutline, people, timeOutline } from 'ionicons/icons';

// Componente responsável por gerir e apresentar a lista de grupos de partilha de garantias
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit, OnDestroy {
  
  // Matriz que armazena os grupos em que o utilizador participa atualmente
  gruposAtivos: Grupo[] = [];
  
  // Matriz que guarda o histórico de grupos que o utilizador já abandonou
  gruposAntigos: Grupo[] = [];
  
  // Matriz que contém apenas os grupos correspondentes ao filtro de interface selecionado
  gruposFiltrados: Grupo[] = []; 
  
  // Guarda o número total de grupos ativos para apresentação no cabeçalho
  totalAtivos: number = 0;
  
  // Define o estado atual selecionado no filtro da interface (ex: 'ativos' ou 'antigos')
  filtroAtual: string = 'ativos';

  // Referência para a subscrição de eventos, permitindo a sua anulação para evitar fugas de memória
  private subscricao!: Subscription;

  // Construtor: inicializa os serviços de dados e navegação, e regista os ícones visuais da interface
  constructor(
    private garantiasService: GarantiasService,
    private router: Router
  ) {
    // Registo do novo ícone timeOutline
    addIcons({ peopleOutline, chevronForwardOutline, addCircleOutline, people, timeOutline });
  }

  // Executado na inicialização: subscreve as notificações do serviço para atualizar a lista automaticamente
  async ngOnInit() {
    this.subscricao = this.garantiasService.dadosAlterados.subscribe(() => {
      this.carregarGrupos();
    });
  }

  // Executado na destruição do componente: anula a subscrição de eventos ativa
  ngOnDestroy() {
    if (this.subscricao) this.subscricao.unsubscribe();
  }

  // Executado sempre que a página fica visível: força a atualização dos dados da lista de grupos
  async ionViewWillEnter() {
    await this.carregarGrupos();
  }

  // Obtém e combina os dados dos grupos provenientes da nuvem, de ficheiros locais e da memória interna
  async carregarGrupos() {
    const perfil = await this.garantiasService.getPerfil();
    
    if (perfil) {
      // Obtém os grupos da base de dados remota (Firebase) associados ao email do perfil
      let todosRemotos = await this.garantiasService.getGruposRemotos(perfil.email);
      
      // Tenta ler e anexar dados de teste locais guardados num ficheiro JSON estático
      try {
        const res = await fetch('/assets/data/grupos.json');
        const dadosJson = await res.json();
        if (dadosJson && dadosJson.grupos) {
          todosRemotos = [...todosRemotos, ...dadosJson.grupos];
        }
      } catch (e) {
        console.error('Aviso: ficheiro grupos.json não encontrado ou vazio.');
      }
      
      // Carrega o histórico de grupos já abandonados a partir do armazenamento local
      this.gruposAntigos = await this.garantiasService.getGruposAntigos();

      // Extrai exclusivamente os identificadores dos grupos presentes no histórico antigo
      const idsAntigos = this.gruposAntigos.map((g: Grupo) => g.id);

      // Isola os grupos ativos filtrando e removendo os que já constam na lista de antigos
      this.gruposAtivos = todosRemotos.filter((g: Grupo) => !idsAntigos.includes(g.id));

      // Dispara a lógica de filtragem final para forçar a atualização gráfica do ecrã
      this.aplicarFiltro(); 
    }
  }
  
  // Captura a alteração do estado do segmento (tabs) na interface e recalcula a matriz apresentada
  mudouFiltro(event: any) {
    this.filtroAtual = event.detail.value;
    this.aplicarFiltro();
  }

  // Atribui à variável de exibição a matriz de dados correspondente ao filtro ativo
  aplicarFiltro() {
    if (this.filtroAtual === 'ativos') {
      this.gruposFiltrados = this.gruposAtivos; 
    } else if (this.filtroAtual === 'antigos') {
      this.gruposFiltrados = this.gruposAntigos; 
    }
    
    // Atualiza a contagem numérica de grupos válidos apresentada na interface
    this.totalAtivos = this.gruposAtivos.length; 
  }

  // Executa o redirecionamento para a rota da página de detalhes, enviando o ID do grupo selecionado
  verGrupo(id: string) {
    this.router.navigate(['/detalhe-grupo', id]);
  }
}