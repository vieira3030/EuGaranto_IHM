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

  async ngOnInit() {
    // Carrega a lista ao iniciar
    this.carregarLista();

    // Fica atento a mudanças (ex: quando alguém apaga um item no detalhe)
    this.garantiasService.dadosAlterados.subscribe(() => {
      this.carregarLista();
    });
  }

  async carregarLista() {
    this.garantias = await this.garantiasService.getGarantias();
  }

  // Reforço para quando mudas de tabs
  async ionViewWillEnter() {
    this.carregarLista();
  }
}