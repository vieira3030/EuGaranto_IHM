import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GarantiasService } from '../services/garantias';

/**
 * Componente da página de listagem de Grupos (Tab 2).
 */
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule] // Importação dos módulos necessários
})
export class Tab2Page {
  // Array que vai guardar os nomes dos grupos para mostrar no ecrã
  listaGrupos: string[] = [];

  // Injeção do serviço de garantias para podermos aceder aos dados
  constructor(private garantiasService: GarantiasService) {}

  /**
   * Ciclo de vida do Ionic: Executado sempre que a página está prestes a entrar no ecrã.
   * Atualiza a lista de grupos consultando o serviço local.
   */
  async ionViewWillEnter() {
    this.listaGrupos = await this.garantiasService.getGrupos();
  }
}