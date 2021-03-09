import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ControlsComponent } from './controls/controls.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
    ],
    declarations: [
        ControlsComponent,
    ],
    exports: [
        ControlsComponent,
    ]
})
export class SharedModule {}
