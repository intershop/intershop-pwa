import { CommonModule } from '@angular/common';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { FieldTooltipComponent } from './field-tooltip/field-tooltip.component';
import { ValidationIconsComponent } from './validation-icons/validation-icons.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';

const components = [FieldTooltipComponent, ValidationIconsComponent];

export const FORMLY_COMPONENTS_IMPORTS = [
  CommonModule,
  FieldTooltipComponent,
  NgbPopoverModule,
  ValidationIconsComponent,
  ValidationMessageComponent,
] as const;

export const FORMLY_COMPONENTS_EXPORTS = [...components] as const;

export class ComponentsModule {}
