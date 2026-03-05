import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { FieldTooltipComponent } from './field-tooltip/field-tooltip.component';
import { ValidationIconsComponent } from './validation-icons/validation-icons.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';

const components = [FieldTooltipComponent, ValidationIconsComponent];

@NgModule({
  imports: [
    CommonModule,
    FieldTooltipComponent,
    NgbPopoverModule,
    ValidationIconsComponent,
    ValidationMessageComponent,
  ],
  exports: [...components],
})
export class ComponentsModule {}
