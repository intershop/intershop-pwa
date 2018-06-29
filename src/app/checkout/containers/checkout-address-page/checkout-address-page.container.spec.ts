import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { MockComponent } from '../../../utils/dev/mock.component';
import { checkoutReducers } from '../../store/checkout.system';
import { CheckoutAddressPageContainerComponent } from './checkout-address-page.container';

describe('Checkout Address Page Container', () => {
  let component: CheckoutAddressPageContainerComponent;
  let fixture: ComponentFixture<CheckoutAddressPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutAddressPageContainerComponent,
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
        MockComponent({
          selector: 'ish-checkout-address',
          template: 'Checkout Address Component',
          inputs: ['basket', 'addresses'],
        }),
      ],

      imports: [
        TranslateModule.forRoot(),
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
        }),
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
});
