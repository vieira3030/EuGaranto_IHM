// Importações dos módulos base do Angular para a configuração de navegação
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importação do componente visual associado ao registo de garantias
import { RegistarGarantiaPage } from './registar-garantia.page';

// Define a rota de acesso padrão para este componente
const routes: Routes = [
  {
    // O caminho em branco ('') carrega automaticamente o componente principal
    path: '',
    component: RegistarGarantiaPage
  }
];

// Regista as rotas definidas como rotas filhas no sistema de navegação da aplicação
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
// Classe responsável por encapsular a configuração de navegação deste ecrã
export class RegistarGarantiaPageRoutingModule {}