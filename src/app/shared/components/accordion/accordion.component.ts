import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'ish-accordion',
  template: `<div class="panel-group"><ng-content></ng-content></div>`,
})
export class AccordionComponent {
  @HostBinding('attr.role') role = 'tablist';
}
