import { Component, OnInit, OnDestroy } from '@angular/core';
import { GarantiasService } from '../services/garantias.service';
import { Subscription } from 'rxjs'; // Necessário para gerir a memória
import { addIcons } from 'ionicons';
import { documentTextOutline, chevronForwardOutline, add, shieldCheckmarkOutline, addCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit, OnDestroy {
  
  // Lista de todas as garantias e a versão filtrada para a interface
  garantias: any[] = [];           
  garantiasFiltradas: any[] = []; 
  filtroAtual: string = 'ativas'; 
  totalAtivas: number = 0; 

  // Referência para cancelar a subscrição e evitar erros de atualização
  private subscricao!: Subscription;

  constructor(private garantiasService: GarantiasService) {
    addIcons({ documentTextOutline, chevronForwardOutline, add, shieldCheckmarkOutline, addCircleOutline });
  }

  // Inicializa a página e mantém a lista sincronizada com o serviço
  ngOnInit() {
    this.carregarLista();
    
    // Escuta alterações globais para refrescar a lista automaticamente
    this.subscricao = this.garantiasService.dadosAlterados.subscribe(() => {
      this.carregarLista();
    });
  }

  // Liberta a subscrição ao sair da página para evitar fugas de memória
  ngOnDestroy() {
    if (this.subscricao) this.subscricao.unsubscribe();
  }

  // Garante que a lista está atualizada sempre que o utilizador regressa a este separador
  async ionViewWillEnter() {
    this.carregarLista();
  }

  // Busca os dados atualizados ao serviço e dispara a lógica de filtro
  async carregarLista() {
    this.garantias = await this.garantiasService.getGarantias();
    this.aplicarFiltro();  
  }

  // Atualiza o critério de visualização quando o utilizador muda de filtro
  mudouFiltro(event: any) {
    this.filtroAtual = event.detail.value;
    this.aplicarFiltro();
  }

  // Filtra as garantias entre válidas e expiradas com base na data de hoje
  aplicarFiltro() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); 

    const ativas = this.garantias.filter(g => {
      if (!g.dataExpiracao) return true; 
      return new Date(g.dataExpiracao) >= hoje;
    });

    const expiradas = this.garantias.filter(g => {
      if (!g.dataExpiracao) return false;
      return new Date(g.dataExpiracao) < hoje;
    });

    // Define a lista exibida conforme a seleção do utilizador
    this.garantiasFiltradas = (this.filtroAtual === 'ativas') ? ativas : expiradas;
    this.totalAtivas = ativas.length;
  }
}