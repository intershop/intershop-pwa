import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from '../components/breadcrumb/breadcrumb.service';
import { FormControlErrorComponent } from '../components/global-form-validation/form-control-error.component';
import { FormGroupValidationComponent } from '../components/global-form-validation/form-group-validation.component';
import { FormValidationDirective } from '../directives/form-validation.directive';

@NgModule({
    exports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        FormGroupValidationComponent,
        FormValidationDirective,
        BreadcrumbComponent
    ],
    declarations: [
        FormGroupValidationComponent,
        FormControlErrorComponent,
        FormValidationDirective,
        BreadcrumbComponent
    ],
    entryComponents: [FormControlErrorComponent],
    imports: [
        CommonModule,
        RouterModule
    ],
    providers: [BreadcrumbService]
})
export class SharedModule { }
