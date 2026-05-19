import { Component, OnInit } from '@angular/core';
import { GarantiasService } from '../services/garantias.service';

// Importar a função de registo de ícones e os ícones específicos
import { addIcons } from 'ionicons';
import { documentTextOutline, chevronForwardOutline, add } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  standalone: false,
})
export class Tab1Page implements OnInit {
  
  // Lista que armazena as garantias carregadas
  garantias: any[] = [];

  constructor(private garantiasService: GarantiasService) {
    // Regista os ícones para ficarem visíveis na interface
    addIcons({ documentTextOutline, chevronForwardOutline, add });
  }

  // Corre na primeira vez que a página é inicializada
  async ngOnInit() {
    this.carregarLista();
    
    // Atualiza a lista automaticamente se os dados mudarem noutro lado
    this.garantiasService.dadosAlterados.subscribe(() => {
      this.carregarLista();
    });
  }

  // Corre sempre que o utilizador entra neste separador
  async ionViewWillEnter() {
    this.carregarLista();
  }

  // Vai buscar os dados mais recentes à base de dados
  async carregarLista() {
    this.garantias = await this.garantiasService.getGarantias();
  }
}