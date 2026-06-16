import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { FieldTooltipComponent } from './field-tooltip/field-tooltip.component';
import { ValidationIconsComponent } from './validation-icons/validation-icons.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';

const components = [FieldTooltipComponent, ValidationIconsComponent, ValidationMessageComponent];

export const FORMLY_COMPONENTS_IMPORTS = [
  FieldTooltipComponent,
  NgbPopoverModule,
  ValidationIconsComponent,
  ValidationMessageComponent,
] as const;

export const FORMLY_COMPONENTS_EXPORTS = [...components] as const;
