import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GarantiaDetalhePage } from './garantia-detalhe.page';

const routes: Routes = [
  {
    path: '',
    component: GarantiaDetalhePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GarantiaDetalhePageRoutingModule {}