import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    // Rota inicial da app: carrega o módulo principal das tabs
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    // Rota para o formulário de criar um novo grupo
    path: 'criar-grupo',
    loadChildren: () => import('./pages/criar-grupo/criar-grupo.module').then(m => m.CriarGrupoPageModule)
  },
  {
    // Rota para ver um grupo: o "/:id" indica que precisa de receber o número do grupo
    path: 'detalhe-grupo/:id',
    loadChildren: () => import('./pages/detalhe-grupo/detalhe-grupo.module').then(m => m.DetalheGrupoPageModule)
  },
  {
    // Rota corrigida: o "/:id" resolve o erro NG04002 para abrir a garantia certa
    path: 'garantia-detalhe/:id',
    loadChildren: () => import('./pages/garantia-detalhe/garantia-detalhe.module').then(m => m.GarantiaDetalhePageModule)
  },
  {
    // Rota para o formulário de registar uma nova garantia
    path: 'registar-garantia',
    loadChildren: () => import('./pages/registar-garantia/registar-garantia.module').then(m => m.RegistarGarantiaPageModule)
  }
];

@NgModule({
  imports: [
    // Inicia as rotas e carrega as páginas em segundo plano (PreloadAllModules) para a app ser mais rápida
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}