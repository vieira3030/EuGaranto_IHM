import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GruposService } from '../../services/grupos';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonBackButton, IonList, IonItem, IonLabel, IonListHeader 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-detalhe-grupo',
  templateUrl: './detalhe-grupo.page.html',
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonListHeader
  ]
})
export class DetalheGrupoPage implements OnInit {
  // Variável para armazenar a informação do grupo selecionado
  grupo: any;

  constructor(
    private route: ActivatedRoute, // Serviço para capturar os parâmetros do URL
    private gruposService: GruposService // Serviço de comunicação com a base de dados
  ) {}

  async ngOnInit() {
    // 1. Extrai o parâmetro 'id' passado na rota (URL)
    const id = this.route.snapshot.paramMap.get('id');
    
    // 2. Se o ID existir, pede ao serviço para procurar os dados desse grupo específico
    if (id) {
      this.grupo = await this.gruposService.getGrupo(id);
    }
  }
}