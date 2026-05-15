import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    // Rota inicial da aplicação
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    // Rota para criar um novo grupo (vazio)
    path: 'criar-grupo',
    loadChildren: () => import('./pages/criar-grupo/criar-grupo.module').then(m => m.CriarGrupoPageModule)
  },
  {
    // NOVA ROTA: Rota para editar um grupo (recebe o ID para preencher o formulário)
    path: 'criar-grupo/:id',
    loadChildren: () => import('./pages/criar-grupo/criar-grupo.module').then(m => m.CriarGrupoPageModule)
  },
  {
    // Rota para detalhes do grupo (recebe o ID)
    path: 'detalhe-grupo/:id',
    loadChildren: () => import('./pages/detalhe-grupo/detalhe-grupo.module').then(m => m.DetalheGrupoPageModule)
  },
  {
    // Rota para detalhes da garantia (recebe o ID)
    path: 'garantia-detalhe/:id',
    loadChildren: () => import('./pages/garantia-detalhe/garantia-detalhe.module').then(m => m.GarantiaDetalhePageModule)
  },
  {
    // Rota para registar uma nova garantia (vazia)
    path: 'registar-garantia',
    loadChildren: () => import('./pages/registar-garantia/registar-garantia.module').then(m => m.RegistarGarantiaPageModule)
  },
  {
    // Rota para editar uma garantia (recebe o ID para preencher o formulário)
    path: 'registar-garantia/:id',
    loadChildren: () => import('./pages/registar-garantia/registar-garantia.module').then(m => m.RegistarGarantiaPageModule)
  }
];

@NgModule({
  imports: [
    // PreloadAllModules torna o carregamento entre páginas mais rápido
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}