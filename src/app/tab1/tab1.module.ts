import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { Tab1PageRoutingModule } from './tab1-routing.module';

@NgModule({
  imports: [
    IonicModule, // Importa os componentes visuais do Ionic
    CommonModule, // Importa diretivas básicas do Angular (ex: *ngIf, *ngFor)
    FormsModule, // Permite a utilização de formulários interativos
    Tab1PageRoutingModule // Importa as rotas exclusivas deste ecrã
  ],
  declarations: [Tab1Page] // Regista o componente principal da página
})
export class Tab1PageModule {}