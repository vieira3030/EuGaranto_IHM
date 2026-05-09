import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GarantiasService } from '../services/garantias';

// Importações corretas para Standalone
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  standalone: false,
  
})
export class Tab1Page implements OnInit {
  garantias: any[] = [];

  constructor(private garantiasService: GarantiasService) {}

  async ngOnInit() {
    this.carregarLista();
    this.garantiasService.dadosAlterados.subscribe(() => {
      this.carregarLista();
    });
  }

  async carregarLista() {
    this.garantias = await this.garantiasService.getGarantias();
  }

  async ionViewWillEnter() {
    this.carregarLista();
  }
}