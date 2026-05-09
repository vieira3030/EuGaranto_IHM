import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { Tab3PageRoutingModule } from './tab3-routing.module';

@NgModule({
  imports: [
    IonicModule, // Interface visual do Ionic
    CommonModule, // Diretivas de controlo (ngIf, ngFor)
    FormsModule, // Gestão de formulários
    Tab3PageRoutingModule // Rotas da Tab 3
  ],
  declarations: [Tab3Page] // Declara a página atual
})
export class Tab3PageModule {}