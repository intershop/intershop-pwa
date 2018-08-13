import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Address } from '../../../models/address/address.model';
import { Basket } from '../../../models/basket/basket.model';
import { getAddressesLoading, getAllAddresses } from '../../store/addresses';
import { LoadAddresses } from '../../store/addresses/addresses.actions';
import {
  getBasketError,
  getBasketLoading,
  getCurrentBasket,
  UpdateBasketInvoiceAddress,
  UpdateBasketShippingAddress,
} from '../../store/basket';
import { CheckoutState } from '../../store/checkout.state';

@Component({
  selector: 'ish-checkout-address-page-container',
  templateUrl: './checkout-address-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressPageContainerComponent implements OnInit {
  basket$: Observable<Basket>;
  addresses$: Observable<Address[]>;
  loading$: Observable<boolean>;
  basketError$: Observable<HttpErrorResponse>;

  constructor(private store: Store<CheckoutState>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
    this.basketError$ = this.store.pipe(select(getBasketError));
    this.store.dispatch(new LoadAddresses());
    this.addresses$ = this.store.pipe(select(getAllAddresses));

    this.loading$ = combineLatest(
      this.store.pipe(select(getBasketLoading)),
      this.store.pipe(select(getAddressesLoading))
    ).pipe(map(([basketLoading, addressesLoading]) => basketLoading || addressesLoading));
  }

  updateBasketInvoiceAddress(addressId: string) {
    this.store.dispatch(new UpdateBasketInvoiceAddress(addressId));
  }

  updateBasketShippingAddress(addressId: string) {
    this.store.dispatch(new UpdateBasketShippingAddress(addressId));
  }
}
