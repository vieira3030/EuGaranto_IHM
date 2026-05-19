import { Component, OnInit } from '@angular/core';
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
  
  // Arrays para gerir os dados
  grupos: Grupo[] = [];
  gruposFiltrados: Grupo[] = [];
  
  // Variáveis para a interface
  totalAtivos: number = 0;
  filtroAtual: string = 'todos';

  constructor(private garantiasService: GarantiasService) {
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
      this.grupos = await this.garantiasService.getGruposRemotos(perfil.email);
      this.aplicarFiltro(); // Aplica o filtro assim que os dados carregam
    }
  }

  // É chamado sempre que o utilizador clica num botão do filtro
  mudouFiltro(event: any) {
    this.filtroAtual = event.detail.value;
    this.aplicarFiltro();
  }

  // Lógica para filtrar a lista apresentada no ecrã
  aplicarFiltro() {
    if (this.filtroAtual === 'todos') {
      this.gruposFiltrados = this.grupos;
    } else if (this.filtroAtual === 'ativos') {
      // Exemplo: mostrar apenas os grupos em que ainda estás ativo
      this.gruposFiltrados = this.grupos; 
    } else if (this.filtroAtual === 'antigos') {
      // Exemplo: mostrar grupos de onde saíste
      this.gruposFiltrados = []; 
    }
    
    // Atualiza o número do banner verde
    this.totalAtivos = this.grupos.length; 
  }
}