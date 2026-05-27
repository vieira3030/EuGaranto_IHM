// Importação do tipo de dados base do Angular para a configuração do sistema de rotas
import { Routes } from '@angular/router';

// Exportação da matriz principal de navegação global da aplicação
export const routes: Routes = [
  {
    // Define o caminho de raiz que encaminha o utilizador para a estrutura de separadores
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    // Define a rota e carrega de forma assíncrona o componente de criação de grupos
    path: 'criar-grupo',
    loadComponent: () => import('./pages/criar-grupo/criar-grupo.page').then( m => m.CriarGrupoPage)
  },
  {
    // Define a rota dinâmica para apresentar os detalhes de um grupo específico através do seu ID
    path: 'detalhe-grupo/:id',
    loadComponent: () => import('./pages/detalhe-grupo/detalhe-grupo.page').then( m => m.DetalheGrupoPage)
  },
  {
    // Define a rota e carrega de forma assíncrona o formulário de registo de novas garantias
    path: 'registar-garantia',
    loadComponent: () => import('./pages/registar-garantia/registar-garantia.page').then( m => m.RegistarGarantiaPage)
  },
  {
    // Define a rota dinâmica para consulta individual de uma garantia utilizando o respetivo ID
    path: 'garantia-detalhe/:id',
    loadComponent: () => import('./pages/garantia-detalhe/garantia-detalhe.page').then( m => m.GarantiaDetalhePage)
  },
  {
    // Define a rota e carrega de forma assíncrona o componente de edição do perfil do utilizador
    path: 'editar-perfil',
    loadComponent: () => import('./pages/editar-perfil/editar-perfil.page').then( m => m.EditarPerfilPage)
  },
];