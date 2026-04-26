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
];