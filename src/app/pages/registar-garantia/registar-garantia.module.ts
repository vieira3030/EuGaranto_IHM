// Importações dos módulos centrais do Angular e do Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Módulo de Reactive Forms adicionado
import { IonicModule } from '@ionic/angular';

// Importações do sistema de navegação e do componente principal
import { RegistarGarantiaPageRoutingModule } from './registar-garantia-routing.module';
import { RegistarGarantiaPage } from './registar-garantia.page';

// Decorador que define as dependências
@NgModule({
  imports: [
    CommonModule, // Fornece as diretivas estruturais nativas
    FormsModule, // Mantido para compatibilidade de outros componentes
    ReactiveFormsModule, // Permite o uso de FormBuilder e FormGroup (Requisito 6)
    IonicModule, // Componentes visuais Ionic
    RegistarGarantiaPageRoutingModule // Rotas
  ],
  declarations: [RegistarGarantiaPage] // Regista o componente principal
})
export class RegistarGarantiaPageModule {}