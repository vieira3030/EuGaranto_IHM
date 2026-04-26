import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; 
import { GarantiasService } from '../services/garantias';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  // 2. E adicionamos o RouterModule a esta lista de imports:
  imports: [CommonModule, IonicModule, RouterModule] 
})
export class Tab1Page {
  listaGarantias: any[] = [];

  constructor(private garantiasService: GarantiasService) {}

  async ionViewWillEnter() {
    this.listaGarantias = await this.garantiasService.getGarantias();
  }
}