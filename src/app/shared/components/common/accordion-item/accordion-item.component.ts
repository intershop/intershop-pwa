import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'ish-accordion-item',
  templateUrl: './accordion-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionItemComponent {
  @Input() heading: string;
  @Input() dataTestingId: string;

  isCollapsed = false;

  ariaControlsId = `aria-controls-${uuid()}`;

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
