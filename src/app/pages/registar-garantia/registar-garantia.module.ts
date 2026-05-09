import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RegistarGarantiaPageRoutingModule } from './registar-garantia-routing.module';
import { RegistarGarantiaPage } from './registar-garantia.page';

@NgModule({
  imports: [
    CommonModule, // Fornece diretivas base como ngIf e ngFor
    FormsModule, // Necessário para o (ngModel) dos campos do formulário
    IonicModule, // Disponibiliza componentes como ion-input e ion-button
    RegistarGarantiaPageRoutingModule // Liga o sistema de rotas desta página
  ],
  declarations: [RegistarGarantiaPage] // Regista o componente no módulo
})
export class RegistarGarantiaPageModule {}