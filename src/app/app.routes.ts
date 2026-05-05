import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'garantia-detalhe/:id', // O :id é o parâmetro que vamos passar
    loadComponent: () => import('./pages/garantia-detalhe/garantia-detalhe.page').then( m => m.GarantiaDetalhePage)
  },
  {
    path: 'registar-garantia',
    loadComponent: () => import('./pages/registar-garantia/registar-garantia.page').then( m => m.RegistarGarantiaPage)
  },
  {
    path: 'registar-garantia',
    loadComponent: () => import('./pages/registar-garantia/registar-garantia.page').then( m => m.RegistarGarantiaPage)
  },  {
    path: 'criar-grupo',
    loadComponent: () => import('./pages/criar-grupo/criar-grupo.page').then( m => m.CriarGrupoPage)
  },

];