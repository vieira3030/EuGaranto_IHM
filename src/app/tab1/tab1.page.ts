import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Resolve o erro do *ngFor
import { IonicModule } from '@ionic/angular';   // Resolve os erros do <ion-...>
import { GarantiasService } from '../services/garantias';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule] // Importa as tags necessárias para o HTML
})
export class Tab1Page {
  listaGarantias: any[] = [];

  constructor(private garantiasService: GarantiasService) {}

  async ionViewWillEnter() {
    this.listaGarantias = await this.garantiasService.getGarantias();
  }
}