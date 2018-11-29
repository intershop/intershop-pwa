import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { MockComponent } from '../../utils/dev/mock.component';

import { CheckoutAddressPageContainerComponent } from './checkout-address-page.container';

describe('Checkout Address Page Container', () => {
  let component: CheckoutAddressPageContainerComponent;
  let fixture: ComponentFixture<CheckoutAddressPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutAddressPageContainerComponent,
        MockComponent({
          selector: 'ish-checkout-address',
          template: 'Checkout Address Component',
          inputs: ['currentUser', 'basket', 'addresses', 'error', 'countries', 'regions', 'titles'],
        }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
      ],

      imports: [
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
        }),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAddressPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render checkout address component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-checkout-address')).toBeTruthy();
  });
});
