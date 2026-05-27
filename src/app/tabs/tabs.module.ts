// Importação do módulo central da framework Ionic para componentes visuais
import { IonicModule } from '@ionic/angular';
// Importação do decorador principal do Angular para a definição de módulos
import { NgModule } from '@angular/core';
// Importação do módulo que fornece as diretivas estruturais básicas (ex: *ngIf, *ngFor)
import { CommonModule } from '@angular/common';
// Importação do módulo para manipulação e ligação de dados em formulários
import { FormsModule } from '@angular/forms';

// Importação da configuração de rotas e do componente principal do contentor de separadores
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';

// Decorador que compila os recursos e as dependências associados a este módulo
@NgModule({
  imports: [
    IonicModule, // Disponibiliza os elementos visuais nativos da interface Ionic
    CommonModule, // Fornece as diretivas nativas do Angular
    FormsModule, // Ativa o suporte a formulários e manipulação de dados
    TabsPageRoutingModule // Injeta as regras de navegação específicas deste contentor
  ],
  declarations: [TabsPage] // Regista o componente principal para ser utilizado pela aplicação
})
// Classe exportada que encapsula toda a estrutura do ecrã de separadores (Tabs)
export class TabsPageModule {}