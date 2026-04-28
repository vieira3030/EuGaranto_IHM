import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    private garantiasService: GarantiasService
  ) { }

  async ngOnInit() {
    // Apanha o ID que vem na hiperligação (URL)
    const id = this.route.snapshot.paramMap.get('id');
    
    // Se houver um ID, pede ao Service para procurar esse produto específico
    if (id) {
      const lista = await this.garantiasService.getGarantias();
      this.garantia = lista.find((g: any) => g.id === id);
    }
  }

  // Função do botão Editar
  editar() {
    // Por agora faz apenas console log, a navegação para o formulário será feita depois
    console.log('Navegar para editar a garantia:', this.garantia.id);
  }

  // Função do botão Eliminar
  async eliminar() {
    // Pede ao serviço para apagar o item da base de dados local
    await this.garantiasService.removerGarantia(this.garantia.id);
    
    // Volta para a página principal automaticamente após apagar
    this.router.navigate(['/']);
  }
}