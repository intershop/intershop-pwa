import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Recurrence } from 'ish-core/models/recurrence/recurrence.model';

@Component({
  selector: 'ish-basket-recurrence-summary',
  templateUrl: './basket-recurrence-summary.component.html',
  styleUrls: ['./basket-recurrence-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketRecurrenceSummaryComponent {
  @Input() recurrence: Recurrence;
}
