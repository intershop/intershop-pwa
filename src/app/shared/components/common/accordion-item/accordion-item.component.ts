import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { IconModule } from 'ish-core/icon.module';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'ish-accordion-item',
  templateUrl: './accordion-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IconModule, NgbCollapseModule],
})
export class AccordionItemComponent {
  @Input() heading: string;
  @Input() dataTestingId: string;

  isCollapsed = true;

  accordionId = uuid();

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
