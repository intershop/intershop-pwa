import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { FieldTooltipComponent } from './field-tooltip/field-tooltip.component';
import { ValidationIconsComponent } from './validation-icons/validation-icons.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';

const components = [FieldTooltipComponent, ValidationIconsComponent];

@NgModule({
  imports: [CommonModule, IconModule, NgbPopoverModule, TranslateModule, ValidationMessageComponent],
  declarations: [...components],
  exports: [...components],
})
export class ComponentsModule {}
