// Importação do decorador principal do Angular para a definição de módulos
import { NgModule } from '@angular/core';
// Importação das ferramentas de navegação e definição de rotas do Angular
import { RouterModule, Routes } from '@angular/router';
// Importação do componente visual que serve de contentor principal aos separadores
import { TabsPage } from './tabs.page';

// Define a matriz hierárquica de configuração de navegação
const routes: Routes = [
  {
    // Define o caminho de acesso base para os separadores
    path: 'tabs',
    // Associa o caminho ao componente contentor
    component: TabsPage,
    // Define as rotas filhas renderizadas dentro do contentor principal
    children: [
      {
        // Define o caminho para o primeiro separador
        path: 'tab1', 
        // Carrega o módulo do separador de forma assíncrona (Lazy Loading) para poupar recursos
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        // Define o caminho para o segundo separador
        path: 'tab2', 
        // Carrega o módulo do separador de forma assíncrona (Lazy Loading)
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        // Define o caminho para o terceiro separador
        path: 'tab3', 
        // Carrega o módulo do separador de forma assíncrona (Lazy Loading)
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        // Interceta caminhos vazios dentro da estrutura de separadores
        path: '',
        // Redireciona a navegação para o primeiro separador
        redirectTo: 'login',
        // Exige uma correspondência exata com o caminho vazio
        pathMatch: 'full'
      }
    ]
  },
  {
    // Interceta a inicialização da aplicação no caminho de raiz
    path: '', 
    // Força o redirecionamento global para a página principal dos separadores
    redirectTo: '/tabs/tab1',
    // Exige uma correspondência exata com o caminho de raiz vazio
    pathMatch: 'full'
  }
];

// Decorador que regista as rotas no sistema de navegação como rotas filhas
@NgModule({
  imports: [RouterModule.forChild(routes)],
})
// Classe exportada que encapsula toda a configuração de navegação dos separadores
export class TabsPageRoutingModule {}