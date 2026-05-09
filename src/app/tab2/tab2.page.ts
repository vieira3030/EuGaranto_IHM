import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GruposService } from '../services/grupos';

// 1. Importar aqui os componentes visuais do Ionic que faltavam
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonList, IonItem, IonLabel 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  standalone: false,
  

})
export class Tab2Page implements OnInit {
  // Variável que guarda o array de grupos a apresentar no ecrã
  grupos: any[] = [];

  constructor(private gruposService: GruposService) {}

  async ngOnInit() {
    this.carregarGrupos();
    
    // Subscreve as alterações no serviço para atualizar a lista automaticamente
    this.gruposService.dadosAlterados.subscribe(() => {
      this.carregarGrupos();
    });
  }

  // Método que vai buscar os grupos à base de dados local
  async carregarGrupos() {
    this.grupos = await this.gruposService.getGrupos();
  }

  // Atualiza a lista sempre que o separador é aberto
  async ionViewWillEnter() {
    this.carregarGrupos();
  }
}