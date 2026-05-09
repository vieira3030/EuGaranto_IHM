import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
  
})
export class Tab3Page {
  // Os dados do utilizador
  utilizador = {
    nome: 'Rodrigo Vieira', 
    email: 'rodrigo.vieira@estudante.pt',
    notificacoes: true,
    modoEscuro: false
  };

  constructor() {}
}