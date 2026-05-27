// Importação do tipo de dados base do Angular para a definição de rotas
import { Routes } from '@angular/router';

// Importação do componente principal que atua como contentor dos separadores
import { TabsPage } from './tabs.page';

// Exportação da matriz de configuração de navegação principal
export const routes: Routes = [
  {
    // Define o caminho base da rota para a estrutura de separadores
    path: 'tabs',
    // Associa o caminho base ao componente de interface respetivo
    component: TabsPage,
    // Define as rotas filhas que carregam o seu conteúdo dentro do contentor principal
    children: [
      {
        // Define o caminho de navegação para o primeiro separador
        path: 'tab1',
        // Carrega o componente de forma assíncrona (Lazy Loading) para otimizar o desempenho
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        // Define o caminho de navegação para o segundo separador
        path: 'tab2',
        // Carrega o componente de forma assíncrona (Lazy Loading) para otimizar o desempenho
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        // Define o caminho de navegação para o terceiro separador
        path: 'tab3',
        // Carrega o componente de forma assíncrona (Lazy Loading) para otimizar o desempenho
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        // Redirecionamento automático interno quando nenhuma sub-rota é especificada
        path: '',
        redirectTo: '/tabs/tab1',
        // Exige correspondência exata e total com o caminho vazio para executar o redirecionamento
        pathMatch: 'full',
      },
    ],
  },
  {
    // Redirecionamento automático global da aplicação aquando da inicialização no caminho base
    path: '',
    redirectTo: '/tabs/tab1',
    // Exige correspondência exata e total com o caminho vazio para executar o redirecionamento
    pathMatch: 'full',
  },
];