import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InstanceService } from '../services/instance.service';
import { FormGroupValidationComponent } from "../components/global-form-validation/form-group-validation.component";
import { FormControlErrorComponent } from "../components/global-form-validation/form-control-error.component";

@NgModule({
    exports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        FormGroupValidationComponent
    ],
    declarations: [
        FormGroupValidationComponent,
        FormControlErrorComponent
    ],
    entryComponents:[FormControlErrorComponent],
    imports: [
        CommonModule
    ],
    providers: [
        InstanceService
    ]
})
export class SharedModule { }
