import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'; 
import { GarantiasService, Grupo } from '../services/garantias.service';
import { Subscription } from 'rxjs'; // Necessário para gerir a memória
import { addIcons } from 'ionicons';
import { peopleOutline, chevronForwardOutline, addCircleOutline, people } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit, OnDestroy {
  
  // Listas de dados para gerir a visualização dos grupos
  gruposAtivos: Grupo[] = [];
  gruposAntigos: Grupo[] = [];
  gruposFiltrados: Grupo[] = []; 
  
  // Contagem total para o cabeçalho e estado do filtro atual
  totalAtivos: number = 0;
  filtroAtual: string = 'ativos';

  // Guarda a subscrição de eventos para poder ser cancelada ao sair
  private subscricao!: Subscription;

  constructor(
    private garantiasService: GarantiasService,
    private router: Router
  ) {
    // Regista os ícones da interface
    addIcons({ peopleOutline, chevronForwardOutline, addCircleOutline, people });
  }

  // Inicializa o ecrã e fica à escuta de alterações de dados globais
  async ngOnInit() {
    this.subscricao = this.garantiasService.dadosAlterados.subscribe(() => {
      this.carregarGrupos();
    });
  }

  // Desliga a escuta de eventos ao fechar a página para poupar memória
  ngOnDestroy() {
    if (this.subscricao) this.subscricao.unsubscribe();
  }

  // Atualiza a lista sempre que o utilizador visualiza este separador
  async ionViewWillEnter() {
    await this.carregarGrupos();
  }

  // Combina os dados da Nuvem, JSON local e Memória Local
  async carregarGrupos() {
    const perfil = await this.garantiasService.getPerfil();
    
    if (perfil) {
      // 1. Vai buscar os grupos reais criados no Firebase
      let todosRemotos = await this.garantiasService.getGruposRemotos(perfil.email);
      
      // 2. Lê os grupos de teste do ficheiro JSON para apresentação
      try {
        const res = await fetch('/assets/data/grupos.json');
        const dadosJson = await res.json();
        if (dadosJson && dadosJson.grupos) {
          // Junta os grupos de teste à lista do Firebase
          todosRemotos = [...todosRemotos, ...dadosJson.grupos];
        }
      } catch (e) {
        console.error('Aviso: ficheiro grupos.json não encontrado ou vazio.');
      }
      
      // 3. Lê o histórico de grupos apagados da memória do telemóvel
      this.gruposAntigos = await this.garantiasService.getGruposAntigos();

      // 4. Cria uma lista apenas com os IDs dos grupos já apagados
      const idsAntigos = this.gruposAntigos.map((g: Grupo) => g.id);

      // 5. Filtra a lista final (rejeita qualquer grupo que já esteja apagado)
      this.gruposAtivos = todosRemotos.filter((g: Grupo) => !idsAntigos.includes(g.id));

      // 6. Atualiza o ecrã com a lista correta
      this.aplicarFiltro(); 
    }
  }
  
  // Muda o critério de visualização quando o utilizador toca nas abas
  mudouFiltro(event: any) {
    this.filtroAtual = event.detail.value;
    this.aplicarFiltro();
  }

  // Define qual lista aparece no ecrã consoante o estado selecionado
  aplicarFiltro() {
    if (this.filtroAtual === 'ativos') {
      this.gruposFiltrados = this.gruposAtivos; 
    } else if (this.filtroAtual === 'antigos') {
      this.gruposFiltrados = this.gruposAntigos; 
    }
    
    // Atualiza o contador verde do topo
    this.totalAtivos = this.gruposAtivos.length; 
  }

  // Redireciona o utilizador para a vista detalhada ao clicar num grupo
  verGrupo(id: string) {
    this.router.navigate(['/detalhe-grupo', id]);
  }
}