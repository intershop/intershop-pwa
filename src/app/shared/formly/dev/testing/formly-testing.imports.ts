import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { FormlyTestingContainerComponent } from './formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from './formly-testing-example/formly-testing-example.component';
import { FormlyTestingFieldgroupExampleComponent } from './formly-testing-fieldgroup-example/formly-testing-fieldgroup-example.component';

export const formlyTestingImports = [
  ReactiveFormsModule,
  FormlyModule.forRoot(),
  FormlyTestingContainerComponent,
  FormlyTestingExampleComponent,
  FormlyTestingFieldgroupExampleComponent,
];
