import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'; // Importante para apanhar o ID
import { GarantiasService } from '../../services/garantias';

@Component({
  selector: 'app-garantia-detalhe',
  templateUrl: './garantia-detalhe.page.html',
  styleUrls: ['./garantia-detalhe.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class GarantiaDetalhePage implements OnInit {
  garantia: any;

  constructor(
    private route: ActivatedRoute,
    private garantiasService: GarantiasService
  ) { }

  async ngOnInit() {
    // 1. Apanha o ID que vem na hiperligação (URL)
    const id = this.route.snapshot.paramMap.get('id');
    
    // 2. Se houver um ID, pede ao Service para procurar esse produto específico
    if (id) {
      const lista = await this.garantiasService.getGarantias();
      this.garantia = lista.find((g: any) => g.id === id);
    }
  }
}