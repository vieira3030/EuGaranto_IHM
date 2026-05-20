import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Necessário para navegar ao clicar no grupo
// Serviço unificado para ler dados direto do Firebase
import { GarantiasService, Grupo } from '../services/garantias.service';

// Importar a função de registo de ícones e os respetivos ícones
import { addIcons } from 'ionicons';
import { peopleOutline, chevronForwardOutline, addCircleOutline, people } from 'ionicons/icons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  
  // Arrays separados para gerir os diferentes estados dos dados
  gruposAtivos: Grupo[] = [];
  gruposAntigos: Grupo[] = [];
  gruposFiltrados: Grupo[] = []; // Esta é a lista que aparece efetivamente no ecrã
  
  // Variáveis para a interface
  totalAtivos: number = 0;
  // O ecrã arranca agora diretamente nos grupos ativos
  filtroAtual: string = 'ativos';

  constructor(
    private garantiasService: GarantiasService,
    private router: Router
  ) {
    // Regista os ícones para ficarem visíveis no HTML
    addIcons({ peopleOutline, chevronForwardOutline, addCircleOutline, people });
  }

  async ngOnInit() {
    this.garantiasService.dadosAlterados.subscribe(() => {
      this.carregarGrupos();
    });
  }

  async ionViewWillEnter() {
    await this.carregarGrupos();
  }

  async carregarGrupos() {
    const perfil = await this.garantiasService.getPerfil();
    
    if (perfil) {
      // 1. Vai buscar TODOS os grupos ao Firebase
      const todosRemotos = await this.garantiasService.getGruposRemotos(perfil.email);
      
      // 2. Vai buscar o histórico de Antigos à memória local do telemóvel
      this.gruposAntigos = JSON.parse(localStorage.getItem('gruposAntigos') || '[]');

      // 3. A MAGIA: Cria uma lista só com os IDs dos grupos antigos
      const idsAntigos = this.gruposAntigos.map((g: Grupo) => g.id);

      // 4. Filtra os Ativos: só entram os grupos que NÃO estão nos antigos
      this.gruposAtivos = todosRemotos.filter((g: Grupo) => !idsAntigos.includes(g.id));

      // 5. Aplica o filtro para desenhar o ecrã
      this.aplicarFiltro(); 
    }
  }
  
  // É chamado sempre que o utilizador clica num botão do filtro
  mudouFiltro(event: any) {
    this.filtroAtual = event.detail.value;
    this.aplicarFiltro();
  }

  // Lógica de filtragem limpa e reduzida apenas aos dois estados
  aplicarFiltro() {
    if (this.filtroAtual === 'ativos') {
      // Mostra apenas os ativos
      this.gruposFiltrados = this.gruposAtivos; 
    } else if (this.filtroAtual === 'antigos') {
      // Mostra o histórico
      this.gruposFiltrados = this.gruposAntigos; 
    }
    
    // Atualiza o número do banner verde (deve contar apenas os ativos reais)
    this.totalAtivos = this.gruposAtivos.length; 
  }

  // Navega para a página de detalhes ao clicar num cartão
  verGrupo(id: string) {
    this.router.navigate(['/detalhe-grupo', id]);
  }
}