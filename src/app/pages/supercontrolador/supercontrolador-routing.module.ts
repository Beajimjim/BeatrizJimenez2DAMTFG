import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupercontroladorPage } from './supercontrolador.page';

const routes: Routes = [
  {
    path: '',
    component: SupercontroladorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupercontroladorPageRoutingModule {}
