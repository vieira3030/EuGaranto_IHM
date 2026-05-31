// Importações nucleares do Angular para a gestão do componente e do seu ciclo de vida
import { Component, OnInit, OnDestroy } from '@angular/core';
import { GarantiasService } from '../services/garantias.service';

// Importação necessária para gerir o fluxo de dados assíncrono e a memória
import { Subscription } from 'rxjs'; 

// Importação do sistema de registo e respetivos ícones visuais do Ionic
import { addIcons } from 'ionicons';
import { documentTextOutline, chevronForwardOutline, add, shieldCheckmarkOutline, addCircleOutline, warningOutline } from 'ionicons/icons';

// Componente responsável por apresentar a listagem principal e gestão de filtros das garantias
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit, OnDestroy {
  
  // Matriz que armazena a totalidade das garantias carregadas do serviço
  garantias: any[] = [];           
  
  // Matriz que contém apenas as garantias que cumprem o critério do filtro ativo
  garantiasFiltradas: any[] = []; 
  
  // Define o estado atual do filtro na interface (ex: 'ativas' ou 'expiradas')
  filtroAtual: string = 'ativas'; 
  
  // Guarda o número total de garantias que ainda se encontram dentro da validade
  totalAtivas: number = 0; 

  // Referência para a subscrição de eventos, permitindo a sua anulação posterior
  private subscricao!: Subscription;

  // Construtor: inicializa o serviço de dados e regista os ícones para utilização na interface
  constructor(private garantiasService: GarantiasService) {
    addIcons({ documentTextOutline, chevronForwardOutline, add, shieldCheckmarkOutline, addCircleOutline, warningOutline });
  }

  // Executado na inicialização: carrega os dados e subscreve as notificações de alteração do serviço
  ngOnInit() {
    this.carregarLista();
    
    // Associa a atualização da lista ao evento de alterações globais do serviço
    this.subscricao = this.garantiasService.dadosAlterados.subscribe(() => {
      this.carregarLista();
    });
  }

  // Executado ao destruir o componente: anula a subscrição de eventos para prevenir fugas de memória
  ngOnDestroy() {
    if (this.subscricao) this.subscricao.unsubscribe();
  }

  // Executado sempre que o separador fica visível: força a atualização completa da lista
  async ionViewWillEnter() {
    this.carregarLista();
  }

  // Solicita os dados atualizados à base local/remota e aplica os filtros de visualização
  async carregarLista() {
    this.garantias = await this.garantiasService.getGarantias();
    this.aplicarFiltro();  
  }

  // Captura a alteração do filtro selecionado pelo utilizador na interface e reavalia a lista
  mudouFiltro(event: any) {
    this.filtroAtual = event.detail.value;
    this.aplicarFiltro();
  }

  // Separa as garantias entre válidas e expiradas com base na comparação com a data atual
  aplicarFiltro() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); 

    // Isola as garantias que não têm data definida ou cuja data é superior/igual à atual
    const ativas = this.garantias.filter(g => {
      if (!g.dataExpiracao) return true; 
      return new Date(g.dataExpiracao) >= hoje;
    });

    // Isola as garantias cuja data limite já foi ultrapassada
    const expiradas = this.garantias.filter(g => {
      if (!g.dataExpiracao) return false;
      return new Date(g.dataExpiracao) < hoje;
    });

    // Define qual a matriz de dados que a interface deve renderizar
    this.garantiasFiltradas = (this.filtroAtual === 'ativas') ? ativas : expiradas;
    
    // Atualiza o contador de garantias válidas
    this.totalAtivas = ativas.length;
  }
}