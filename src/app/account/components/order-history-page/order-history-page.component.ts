import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-order-history-page',
  templateUrl: './order-history-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderHistoryPageComponent {}
