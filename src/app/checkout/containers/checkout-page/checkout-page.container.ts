import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CoreState } from '../../../core/store/core.state';
import { getRoutingData } from '../../../core/store/routing-data';

@Component({
  templateUrl: './checkout-page.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckoutPageContainerComponent implements OnInit {
  checkoutStep$: Observable<number>;

  constructor(private store: Store<CoreState>) {}

  ngOnInit() {
    this.checkoutStep$ = this.store.pipe(select(getRoutingData('checkoutStep')));
  }
}
