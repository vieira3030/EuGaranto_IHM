// Importações dos módulos base do Angular para a configuração de navegação
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importação do componente visual associado ao terceiro separador (Tab 3)
import { Tab3Page } from './tab3.page';

// Define a matriz de rotas de acesso específicas para este separador
const routes: Routes = [
  {
    // O caminho em branco ('') determina o carregamento automático da página principal da rota
    path: '',
    component: Tab3Page, // Associa a rota diretamente ao componente visual correspondente
  }
];

// Decorador que regista as rotas definidas no sistema de navegação como rotas filhas
@NgModule({
  imports: [RouterModule.forChild(routes)], // Injeta as configurações de rotas locais no módulo
  exports: [RouterModule] // Disponibiliza o módulo de navegação configurado para consumo externo
})
// Classe responsável por encapsular a configuração de rotas deste ecrã
export class Tab3PageRoutingModule {}