// Importações dos módulos centrais do Angular e do Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Importações do sistema de navegação e do componente principal do ecrã
import { GarantiaDetalhePageRoutingModule } from './garantia-detalhe-routing.module';
import { GarantiaDetalhePage } from './garantia-detalhe.page';

// Decorador que define as dependências e a configuração do módulo da página
@NgModule({
  imports: [
    CommonModule, // Fornece as diretivas estruturais nativas do Angular (ex: *ngIf, *ngFor)
    FormsModule, // Permite a ligação bidirecional de dados (ngModel)
    IonicModule, // Disponibiliza os componentes visuais nativos da framework Ionic
    GarantiaDetalhePageRoutingModule // Injeta a configuração de rotas específicas desta página
  ],
  declarations: [GarantiaDetalhePage] // Regista o componente principal para ser utilizado no módulo
})
// Classe exportada que encapsula os recursos do ecrã de detalhes da garantia
export class GarantiaDetalhePageModule {}