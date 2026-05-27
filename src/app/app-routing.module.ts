// Importações nucleares do Angular para a configuração do sistema de navegação global
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// Define a matriz principal de rotas de toda a aplicação
const routes: Routes = [
  {
    // Define o caminho de raiz que encaminha o utilizador para a interface de separadores
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    // Define a rota de acesso ao formulário de criação de um novo grupo vazio
    path: 'criar-grupo',
    loadChildren: () => import('./pages/criar-grupo/criar-grupo.module').then(m => m.CriarGrupoPageModule)
  },
  {
    // Define a rota dinâmica para carregar o formulário de edição de um grupo específico através do seu ID
    path: 'criar-grupo/:id',
    loadChildren: () => import('./pages/criar-grupo/criar-grupo.module').then(m => m.CriarGrupoPageModule)
  },
  {
    // Define a rota dinâmica de consulta detalhada de um grupo através do respetivo ID
    path: 'detalhe-grupo/:id',
    loadChildren: () => import('./pages/detalhe-grupo/detalhe-grupo.module').then(m => m.DetalheGrupoPageModule)
  },
  {
    // Define a rota dinâmica de consulta detalhada de uma garantia através do respetivo ID
    path: 'garantia-detalhe/:id',
    loadChildren: () => import('./pages/garantia-detalhe/garantia-detalhe.module').then(m => m.GarantiaDetalhePageModule)
  },
  {
    // Define a rota de acesso ao formulário de registo de uma nova garantia vazia
    path: 'registar-garantia',
    loadChildren: () => import('./pages/registar-garantia/registar-garantia.module').then(m => m.RegistarGarantiaPageModule)
  },
  {
    // Define a rota dinâmica para carregar o formulário de edição de uma garantia específica através do seu ID
    path: 'registar-garantia/:id',
    loadChildren: () => import('./pages/registar-garantia/registar-garantia.module').then(m => m.RegistarGarantiaPageModule)
  }
];

// Decorador que regista as rotas no sistema principal de navegação da aplicação
@NgModule({
  imports: [
    // Aplica a estratégia de pré-carregamento em segundo plano de todos os módulos para otimizar o desempenho
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  // Disponibiliza o módulo de navegação configurado para consumo global
  exports: [RouterModule]
})
// Classe responsável por encapsular toda a configuração de rotas base do projeto
export class AppRoutingModule {}