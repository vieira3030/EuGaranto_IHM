import { Component } from '@angular/core';
import { GarantiasService } from '../services/garantias.service'; // Importa o serviço

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  // Variável para guardar os dados do utilizador
  perfil: any = null;

  constructor(private garantiasService: GarantiasService) {}

  // Carrega os dados sempre que o utilizador entra na tab
  async ionViewWillEnter() {
    this.perfil = await this.garantiasService.getPerfil();
  }

  // Função para o botão de sair
  terminarSessao() {
    console.log('Sessão terminada');
  }
}