// Importações dos módulos centrais do Angular e do Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Importações do sistema de navegação e do componente principal do ecrã
import { RegistarGarantiaPageRoutingModule } from './registar-garantia-routing.module';
import { RegistarGarantiaPage } from './registar-garantia.page';

// Decorador que define as dependências e a configuração do módulo da página
@NgModule({
  imports: [
    CommonModule, // Fornece as diretivas estruturais nativas do Angular (ex: *ngIf, *ngFor)
    FormsModule, // Permite a ligação bidirecional de dados nos formulários (ngModel)
    IonicModule, // Disponibiliza os componentes visuais nativos da framework Ionic
    RegistarGarantiaPageRoutingModule // Injeta a configuração de rotas específicas desta página
  ],
  declarations: [RegistarGarantiaPage] // Regista o componente principal para ser reconhecido no módulo
})
// Classe exportada que encapsula os recursos do ecrã de registo de garantias
export class RegistarGarantiaPageModule {}