import { Routes } from '@angular/router';

export const routes: Routes = [
  {
   // Ficheiro principal de rotas da aplicação (EuGaranto)
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    // Rota para o formulário de criação de novos grupos de partilha
    path: 'criar-grupo',
    loadComponent: () => import('./pages/criar-grupo/criar-grupo.page').then( m => m.CriarGrupoPage)
  },
  {
    // Rota de detalhe do grupo que recebe o ID como parâmetro dinâmico
    path: 'detalhe-grupo/:id',
    loadComponent: () => import('./pages/detalhe-grupo/detalhe-grupo.page').then( m => m.DetalheGrupoPage)
  },
  {
    // Rota para o formulário de registo de novas garantias
    path: 'registar-garantia',
    loadComponent: () => import('./pages/registar-garantia/registar-garantia.page').then( m => m.RegistarGarantiaPage)
  },
  {
    // Rota de detalhe da garantia que recebe o ID do produto para consulta
    path: 'garantia-detalhe/:id',
    loadComponent: () => import('./pages/garantia-detalhe/garantia-detalhe.page').then( m => m.GarantiaDetalhePage)
  },  {
    path: 'editar-perfil',
    loadComponent: () => import('./editar-perfil/editar-perfil.page').then( m => m.EditarPerfilPage)
  },

];