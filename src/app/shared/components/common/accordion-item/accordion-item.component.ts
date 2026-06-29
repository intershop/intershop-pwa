import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'ish-accordion-item',
  imports: [NgbCollapse],
  standalone: true,
  templateUrl: './accordion-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
