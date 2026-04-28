import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { GarantiasService } from '../services/garantias';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class Tab1Page implements OnInit {
  garantias: any[] = [];

  constructor(private garantiasService: GarantiasService) {}

  /** Inicializa o componente e subscreve o evento de alteração de dados do serviço. */
  async ngOnInit() {
    this.carregarLista();

    this.garantiasService.dadosAlterados.subscribe(() => {
      this.carregarLista();
    });
  }

  /** Obtém a lista atualizada de garantias através do serviço. */
  async carregarLista() {
    this.garantias = await this.garantiasService.getGarantias();
  }

  /** Garante a atualização dos dados expostos na interface sempre que o componente entra em foco. */
  async ionViewWillEnter() {
    this.carregarLista();
  }
}