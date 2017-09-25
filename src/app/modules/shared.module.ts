import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormControlErrorComponent } from '../components/global-form-validation/form-control-error.component';
import { FormGroupValidationComponent } from '../components/global-form-validation/form-group-validation.component';
import { InstanceService } from '../services/instance.service';

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
    entryComponents: [FormControlErrorComponent],
    imports: [
        CommonModule
    ],
    providers: [
        InstanceService
    ]
})
export class SharedModule { }
