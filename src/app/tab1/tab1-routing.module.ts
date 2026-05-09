import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';

// Define o caminho para aceder a esta página
const routes: Routes = [
  {
    path: '',
    component: Tab1Page, // Carrega o ecrã da Tab 1 quando a rota é ativada
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Configura as rotas locais do módulo
  exports: [RouterModule] // Disponibiliza as rotas para o módulo principal
})
export class Tab1PageRoutingModule {}