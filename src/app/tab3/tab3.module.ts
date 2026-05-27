// Importações dos módulos centrais do Angular e da framework Ionic
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importações do componente principal e da configuração de rotas do separador
import { Tab3Page } from './tab3.page';
import { Tab3PageRoutingModule } from './tab3-routing.module';

// Decorador que define as dependências e a estrutura modular desta página
@NgModule({
  imports: [
    IonicModule, // Disponibiliza os componentes visuais nativos da framework Ionic
    CommonModule, // Fornece as diretivas estruturais nativas do Angular (ex: *ngIf, *ngFor)
    FormsModule, // Ativa a manipulação bidirecional de dados e o suporte a formulários
    Tab3PageRoutingModule // Injeta as configurações de navegação específicas deste ecrã
  ],
  declarations: [Tab3Page] // Regista o componente principal para ser reconhecido na interface
})
// Classe exportada que encapsula os recursos do terceiro separador (Tab 3)
export class Tab3PageModule {}