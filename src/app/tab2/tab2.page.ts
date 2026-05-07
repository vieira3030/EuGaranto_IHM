import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GruposService } from '../services/grupos';

import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  standalone: true,
  imports: [CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton]
})
export class Tab2Page implements OnInit {
  grupos: any[] = [];

  constructor(private gruposService: GruposService) {}

  async ngOnInit() {
    this.carregarGrupos();
    
    // Fica à escuta de novos grupos para atualizar a lista automaticamente
    this.gruposService.dadosAlterados.subscribe(() => {
      this.carregarGrupos();
    });
  }

  async carregarGrupos() {
    this.grupos = await this.gruposService.getGrupos();
  }

  // Atualiza a lista sempre que o separador é aberto
  async ionViewWillEnter() {
    this.carregarGrupos();
  }
}