import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule as FormlyBaseModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { ComponentsModule } from 'ish-shared/formly/components/components.module';

import { DescriptionWrapperComponent } from './description-wrapper/description-wrapper.component';
import { HorizontalCheckboxWrapperComponent } from './horizontal-checkbox-wrapper/horizontal-checkbox-wrapper.component';
import { HorizontalWrapperComponent } from './horizontal-wrapper/horizontal-wrapper.component';
import { InputAddonWrapperComponent } from './input-addon-wrapper/input-addon-wrapper.component';
import { TextareaDescriptionWrapperComponent } from './textarea-description-wrapper/textarea-description-wrapper.component';
import { TooltipWrapperComponent } from './tooltip-wrapper/tooltip-wrapper.component';
import { ValidationWrapperComponent } from './validation-wrapper/validation-wrapper.component';

const wrapperComponents = [
  DescriptionWrapperComponent,
  HorizontalCheckboxWrapperComponent,
  HorizontalWrapperComponent,
  InputAddonWrapperComponent,
  TextareaDescriptionWrapperComponent,
  TooltipWrapperComponent,
  ValidationWrapperComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormlyBaseModule.forChild({
      wrappers: [
        { name: 'form-field-horizontal', component: HorizontalWrapperComponent },
        { name: 'form-field-checkbox-horizontal', component: HorizontalCheckboxWrapperComponent },
        { name: 'input-addon', component: InputAddonWrapperComponent },
        { name: 'textarea-description', component: TextareaDescriptionWrapperComponent },
        { name: 'tooltip', component: TooltipWrapperComponent },
        { name: 'validation', component: ValidationWrapperComponent },
        { name: 'description', component: DescriptionWrapperComponent },
      ],
    }),
  ],
  declarations: [...wrapperComponents],
  exports: [...wrapperComponents],
})
export class WrappersModule {}
