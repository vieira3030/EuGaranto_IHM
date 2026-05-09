import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CriarGrupoPage } from './criar-grupo.page';

// Define a rota de acesso principal para este ecrã
const routes: Routes = [
  {
    path: '',
    component: CriarGrupoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CriarGrupoPageRoutingModule {}