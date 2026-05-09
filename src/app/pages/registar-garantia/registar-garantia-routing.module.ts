import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistarGarantiaPage } from './registar-garantia.page';

// Define a rota padrão para carregar esta página
const routes: Routes = [
  {
    path: '',
    component: RegistarGarantiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistarGarantiaPageRoutingModule {}