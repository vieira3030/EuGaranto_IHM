// Importações dos módulos centrais do Angular e da framework Ionic
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importações do componente principal e da configuração de rotas do separador
import { Tab2Page } from './tab2.page';
import { Tab2PageRoutingModule } from './tab2-routing.module';

// Decorador que define as dependências e a estrutura modular desta página
@NgModule({
  imports: [
    IonicModule, // Disponibiliza os componentes visuais nativos da framework Ionic
    CommonModule, // Fornece as diretivas estruturais nativas do Angular (ex: *ngIf, *ngFor)
    FormsModule, // Ativa a manipulação bidirecional de dados e o suporte a formulários
    Tab2PageRoutingModule // Injeta as configurações de navegação específicas deste ecrã
  ],
  declarations: [Tab2Page] // Regista o componente principal para ser reconhecido na interface
})
// Classe exportada que encapsula os recursos do segundo separador (Tab 2)
export class Tab2PageModule {}