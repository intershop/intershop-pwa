import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Recurrence } from 'ish-core/models/recurrence/recurrence.model';
import { OrderRecurrenceComponent } from 'ish-shared/components/order/order-recurrence/order-recurrence.component';

@Component({
  selector: 'ish-basket-recurrence-summary',
  templateUrl: './basket-recurrence-summary.component.html',
  styleUrls: ['./basket-recurrence-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, OrderRecurrenceComponent, TranslatePipe],
})
export class BasketRecurrenceSummaryComponent {
  @Input({ required: true }) recurrence: Recurrence;
}
