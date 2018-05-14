import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { Basket } from '../../../models/basket/basket.model';
import { MockComponent } from '../../../utils/dev/mock.component';
import { LoadBasket, LoadBasketItemsSuccess, LoadBasketSuccess } from '../../store/basket/basket.actions';
import { CheckoutState } from '../../store/checkout.state';
import { checkoutReducers } from '../../store/checkout.system';
import { CheckoutAddressPageContainerComponent } from './checkout-address-page.container';

describe('Checkout Address Page Container', () => {
  let component: CheckoutAddressPageContainerComponent;
  let fixture: ComponentFixture<CheckoutAddressPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<CheckoutState>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          CheckoutAddressPageContainerComponent,
          MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
        ],
        imports: [
          TranslateModule.forRoot(),
          StoreModule.forRoot({
            checkout: combineReducers(checkoutReducers),
          }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAddressPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
