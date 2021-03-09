import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTravelItemPage } from './add-travel-item.page';

const routes: Routes = [
  {
    path: '',
    component: AddTravelItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTravelItemPageRoutingModule {}
