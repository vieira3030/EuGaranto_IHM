import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CriarGrupoPageRoutingModule } from './criar-grupo-routing.module';
import { CriarGrupoPage } from './criar-grupo.page';

@NgModule({
  imports: [
    CommonModule, // Fornece as diretivas base do Angular (ex: ngIf)
    FormsModule, // Permite ligar os inputs aos dados (ngModel)
    IonicModule, // Ativa a interface e componentes visuais do Ionic
    CriarGrupoPageRoutingModule // Importa a rota para chegar a este ecrã
  ],
  declarations: [CriarGrupoPage] // Regista esta página no módulo
})
export class CriarGrupoPageModule {}