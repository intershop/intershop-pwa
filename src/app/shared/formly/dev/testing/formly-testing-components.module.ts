import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyForm, FormlyModule } from '@ngx-formly/core';

import { FormlyTestingContainerComponent } from './formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from './formly-testing-example/formly-testing-example.component';
import { FormlyTestingFieldgroupExampleComponent } from './formly-testing-fieldgroup-example/formly-testing-fieldgroup-example.component';

@NgModule({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imports: [CommonModule, FormlyModule.forRoot({ formlyForm: FormlyForm } as any), ReactiveFormsModule],
  declarations: [
    FormlyTestingContainerComponent,
    FormlyTestingExampleComponent,
    FormlyTestingFieldgroupExampleComponent,
  ],
  exports: [FormlyModule, FormlyTestingContainerComponent, FormlyTestingExampleComponent],
})
// eslint-disable-next-line ish-custom-rules/project-structure
export class FormlyTestingComponentsModule {}
