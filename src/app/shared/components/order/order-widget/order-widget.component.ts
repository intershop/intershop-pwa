import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The Order Widget Component - displays an noverview of the latest orders as list.
 *
 * @example
 * <ish-order-widget></ish-order-widget>
 */
@Component({
  selector: 'ish-order-widget',
  templateUrl: './order-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderWidgetComponent {}
