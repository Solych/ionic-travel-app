import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'add',
    loadChildren: () => import('./add-travel-item/add-travel-item.module').then( m => m.AddTravelItemPageModule)
  },
  {
    path: 'show/:id',
    loadChildren: () => import('./add-travel-item/add-travel-item.module').then( m => m.AddTravelItemPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
