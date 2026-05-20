import { Component, OnInit } from '@angular/core';
import { GarantiasService } from '../services/garantias.service';

// Importar os ícones necessários
import { addIcons } from 'ionicons';
import { documentTextOutline, chevronForwardOutline, add, shieldCheckmarkOutline, addCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  
  // Variáveis para gerir a lista e os filtros
  garantias: any[] = [];          
  garantiasFiltradas: any[] = []; 
  filtroAtual: string = 'ativas'; // Começa diretamente nas ativas
  totalAtivas: number = 0; 

  constructor(private garantiasService: GarantiasService) {
    // Regista os ícones para poderem ser usados no HTML
    addIcons({ documentTextOutline, chevronForwardOutline, add, shieldCheckmarkOutline, addCircleOutline });
  }

  // Executa ao iniciar a página
  async ngOnInit() {
    this.carregarLista();
    
    // Atualiza a lista automaticamente se houver mudanças noutras páginas
    this.garantiasService.dadosAlterados.subscribe(() => {
      this.carregarLista();
    });
  }

  // Executa sempre que o separador fica visível
  async ionViewWillEnter() {
    this.carregarLista();
  }

  // Vai buscar os dados e aplica o filtro
  async carregarLista() {
    this.garantias = await this.garantiasService.getGarantias();
    this.aplicarFiltro();  
  }

  // Atualiza o estado quando mudas de aba no ecrã
  mudouFiltro(event: any) {
    this.filtroAtual = event.detail.value;
    this.aplicarFiltro();
  }

  // Separa as garantias consoante a data atual e mostra a lista certa
  aplicarFiltro() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Ignora as horas para comparar apenas os dias

    // Guarda as que ainda estão válidas ou não têm data definida
    const ativas = this.garantias.filter(g => {
      if (!g.dataExpiracao) return true; 
      const dataExp = new Date(g.dataExpiracao);
      return dataExp >= hoje;
    });

    // Guarda as que já ultrapassaram a data de hoje
    const expiradas = this.garantias.filter(g => {
      if (!g.dataExpiracao) return false;
      const dataExp = new Date(g.dataExpiracao);
      return dataExp < hoje;
    });

    // Define qual lista aparece no ecrã
    if (this.filtroAtual === 'ativas') {
      this.garantiasFiltradas = ativas;
    } else if (this.filtroAtual === 'expiradas') {
      this.garantiasFiltradas = expiradas;
    }

    // Atualiza o número verde do topo apenas com as garantias válidas
    this.totalAtivas = ativas.length;
  }
}