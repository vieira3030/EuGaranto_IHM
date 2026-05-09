import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { Tab2PageRoutingModule } from './tab2-routing.module';

@NgModule({
  imports: [
    IonicModule, // Interface visual do Ionic
    CommonModule, // Diretivas de controlo (ngIf, ngFor)
    FormsModule, // Gestão de formulários
    Tab2PageRoutingModule // Rotas da Tab 2
  ],
  declarations: [Tab2Page] // Declara a página atual
})
export class Tab2PageModule {}
