import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DetalheGrupoPageRoutingModule } from './detalhe-grupo-routing.module';
import { DetalheGrupoPage } from './detalhe-grupo.page';

@NgModule({
  imports: [
    CommonModule, // Diretivas estruturais (ngIf, ngFor)
    FormsModule, // Manipulação de dados de formulários
    IonicModule, // Interface da framework
    DetalheGrupoPageRoutingModule // Sistema de rotas deste ecrã
  ],
  declarations: [DetalheGrupoPage] // Registo da página
})
export class DetalheGrupoPageModule {}