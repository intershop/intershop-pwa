import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Recurrence } from 'ish-core/models/recurrence/recurrence.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { FrequencyPipe } from 'ish-core/pipes/frequency.pipe';

@Component({
  selector: 'ish-order-recurrence',
  imports: [DatePipe, FrequencyPipe, TranslatePipe],
  standalone: true,
  templateUrl: './order-recurrence.component.html',
  styleUrls: ['./order-recurrence.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderRecurrenceComponent {
  @Input({ required: true }) recurrence: Recurrence;
  @Input() labelCssClass: string;
  @Input() valueCssClass: string;
}
