import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'criar-grupo',
    loadComponent: () => import('./pages/criar-grupo/criar-grupo.page').then( m => m.CriarGrupoPage)
  },
  {
    // A rota ':id' permite receber um parâmetro dinâmico na navegação,
    // essencial para saber qual grupo mostrar na página de detalhes.
    path: 'detalhe-grupo/:id',
    loadComponent: () => import('./pages/detalhe-grupo/detalhe-grupo.page').then( m => m.DetalheGrupoPage)
  },
];