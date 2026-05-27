// Importações dos módulos centrais do Angular para a configuração de navegação
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importação do componente visual que será renderizado por esta rota
import { CriarGrupoPage } from './criar-grupo.page';

// Define a matriz de rotas específicas para este módulo
const routes: Routes = [
  {
    // O caminho vazio ('') define o componente base a carregar quando a rota é ativada
    path: '',
    component: CriarGrupoPage
  }
];

// Decorador que regista estas rotas como dependentes (filhas) da hierarquia principal da aplicação
@NgModule({
  imports: [RouterModule.forChild(routes)], // Injeta as rotas definidas acima no sistema do Angular
  exports: [RouterModule], // Exporta o módulo de navegação configurado para uso no módulo da página
})
// Classe que encapsula e disponibiliza as configurações de rota desta página
export class CriarGrupoPageRoutingModule {}