import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ControlsComponent } from './controls/controls.component';
import {HeaderComponent} from './header/header.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
    ],
    declarations: [
        ControlsComponent,
        HeaderComponent
    ],
    exports: [
        ControlsComponent,
        HeaderComponent,
    ]
})
export class SharedModule {}
