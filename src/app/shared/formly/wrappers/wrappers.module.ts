import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule as FormlyBaseModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';

import { FieldTooltipComponent } from './components/field-tooltip/field-tooltip.component';
import { ValidationIconsComponent } from './components/validation-icons/validation-icons.component';
import { ValidationMessageComponent } from './components/validation-message/validation-message.component';
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
  FieldTooltipComponent,
  ValidationIconsComponent,
  ValidationMessageComponent,
];

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    NgbPopoverModule,
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
