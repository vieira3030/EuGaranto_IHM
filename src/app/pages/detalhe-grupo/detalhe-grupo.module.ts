// Importações dos módulos centrais do Angular e do Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Importações da rota e do componente principal do ecrã de detalhes do grupo
import { DetalheGrupoPageRoutingModule } from './detalhe-grupo-routing.module';
import { DetalheGrupoPage } from './detalhe-grupo.page';

// Decorador que define as dependências e configuração do módulo da página
@NgModule({
  imports: [
    CommonModule, // Fornece as diretivas estruturais nativas do Angular (ex: *ngIf, *ngFor)
    FormsModule, // Ativa a manipulação bidirecional de dados e formulários (ngModel)
    IonicModule, // Disponibiliza os componentes visuais nativos do Ionic na interface
    DetalheGrupoPageRoutingModule // Importa a configuração de navegação específica deste ecrã
  ],
  declarations: [DetalheGrupoPage] // Regista o componente para ser reconhecido na interface gráfica
})
// Classe exportada que encapsula e disponibiliza os recursos do ecrã de detalhes do grupo
export class DetalheGrupoPageModule {}