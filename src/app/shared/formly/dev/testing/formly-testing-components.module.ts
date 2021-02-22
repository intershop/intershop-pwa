import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { FormlyTestingContainerComponent } from './formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from './formly-testing-example/formly-testing-example.component';
import { FormlyTestingFieldgroupExampleComponent } from './formly-testing-fieldgroup-example/formly-testing-fieldgroup-example.component';

@NgModule({
  imports: [CommonModule, FormlyModule.forRoot(), ReactiveFormsModule],
  declarations: [
    FormlyTestingContainerComponent,
    FormlyTestingExampleComponent,
    FormlyTestingFieldgroupExampleComponent,
  ],
  exports: [FormlyTestingContainerComponent, FormlyTestingExampleComponent],
})
// tslint:disable: project-structure
export class FormlyTestingComponentsModule {}
