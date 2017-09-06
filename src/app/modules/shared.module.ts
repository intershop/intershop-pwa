import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InstanceService } from '../services/instance.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControlMessages } from "../components/form-control-messages";

@NgModule({
    exports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        FormControlMessages
    ],
    declarations: [FormControlMessages],
    imports: [
        CommonModule
    ],
    providers: [
        InstanceService
    ]
})
export class SharedModule { }
