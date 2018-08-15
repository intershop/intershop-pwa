import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-order-list',
  templateUrl: './order-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent {}
