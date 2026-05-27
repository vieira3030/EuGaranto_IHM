// Importações dos módulos centrais do Angular e da framework Ionic
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importações do componente principal e do sistema de navegação do separador
import { Tab1Page } from './tab1.page';
import { Tab1PageRoutingModule } from './tab1-routing.module';

// Decorador que define as dependências e a configuração do módulo da página
@NgModule({
  imports: [
    IonicModule, // Disponibiliza os componentes visuais nativos da framework Ionic
    CommonModule, // Fornece as diretivas estruturais nativas do Angular (ex: *ngIf, *ngFor)
    FormsModule, // Permite a ligação bidirecional de dados e a manipulação de formulários
    Tab1PageRoutingModule // Injeta a configuração de rotas específicas deste ecrã
  ],
  declarations: [Tab1Page] // Regista o componente principal para ser reconhecido pelo módulo
})
// Classe exportada que encapsula os recursos do primeiro separador (Tab 1)
export class Tab1PageModule {}