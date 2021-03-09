import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTravelItemPageRoutingModule } from './add-travel-item-routing.module';

import { AddTravelItemPage } from './add-travel-item.page';
import { SharedModule } from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddTravelItemPageRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  declarations: [AddTravelItemPage]
})
export class AddTravelItemPageModule {}
