import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    IonicModule, // Interface do Ionic
    CommonModule, // Diretivas do Angular
    FormsModule, // Formulários
    TabsPageRoutingModule // Sistema de rotas deste contentor
  ],
  declarations: [TabsPage] // Declara a página das tabs
})
export class TabsPageModule {}