import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Recurrence } from 'ish-core/models/recurrence/recurrence.model';

@Component({
  selector: 'ish-order-recurrence',
  templateUrl: './order-recurrence.component.html',
  styleUrls: ['./order-recurrence.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderRecurrenceComponent {
  @Input() recurrence: Recurrence;
  @Input() labelCssClass: string;
  @Input() valueCssClass: string;
}
