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
  filtroAtual: string = 'todas';   
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

  // Vai buscar os dados e atualiza o ecrã
  async carregarLista() {
    this.garantias = await this.garantiasService.getGarantias();
    this.calcularTotais(); 
    this.aplicarFiltro();  
  }

  // Calcula quantas garantias não estão expiradas
  calcularTotais() {
    this.totalAtivas = this.garantias.filter(g => g.diasRestantes > 0).length;
  }

  // Atualiza o estado quando mudas de aba (Todas/Ativas/Expiradas)
  mudouFiltro(event: any) {
    this.filtroAtual = event.detail.value;
    this.aplicarFiltro();
  }

  // Aplica o filtro selecionado à lista que aparece no ecrã
  aplicarFiltro() {
    if (this.filtroAtual === 'todas') {
      this.garantiasFiltradas = [...this.garantias];
    } else if (this.filtroAtual === 'ativas') {
      this.garantiasFiltradas = this.garantias.filter(g => g.diasRestantes > 0);
    } else if (this.filtroAtual === 'expiradas') {
      this.garantiasFiltradas = this.garantias.filter(g => g.diasRestantes <= 0);
    }
  }
}