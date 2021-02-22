import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { FormsSharedModule } from 'ish-shared/forms/forms.module';

import { CheckboxDynamicComponent } from './components/checkbox-dynamic/checkbox-dynamic.component';
import { InputDynamicComponent } from './components/input-dynamic/input-dynamic.component';
import { SelectDynamicComponent } from './components/select-dynamic/select-dynamic.component';

// not-dead-code
@NgModule({
  imports: [
    CommonModule,
    FormlyModule.forRoot({
      types: [
        { name: 'input', component: InputDynamicComponent },
        { name: 'select', component: SelectDynamicComponent },
        { name: 'checkbox', component: CheckboxDynamicComponent },
      ],
    }),
    FormsSharedModule,
    ReactiveFormsModule,
  ],
  declarations: [CheckboxDynamicComponent, InputDynamicComponent, SelectDynamicComponent],
  exports: [CheckboxDynamicComponent, InputDynamicComponent, SelectDynamicComponent],
})
export class FormsDynamicModule {
  constructor() {
    console.warn('FormsDynamicModule is deprecated, please use the new formly implementation.');
  }
}
