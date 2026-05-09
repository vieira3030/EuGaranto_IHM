import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GarantiaDetalhePageRoutingModule } from './garantia-detalhe-routing.module';
import { GarantiaDetalhePage } from './garantia-detalhe.page';

@NgModule({
  imports: [
    CommonModule, // Diretivas básicas
    FormsModule, // Formulários
    IonicModule, // Interface
    GarantiaDetalhePageRoutingModule // Rotas
  ],
  declarations: [GarantiaDetalhePage] // Registo da página
})
export class GarantiaDetalhePageModule {}