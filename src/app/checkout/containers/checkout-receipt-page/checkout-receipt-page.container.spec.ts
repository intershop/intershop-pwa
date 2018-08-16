import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { MockComponent } from '../../../utils/dev/mock.component';
import { checkoutReducers } from '../../store/checkout.system';

import { CheckoutReceiptPageContainerComponent } from './checkout-receipt-page.container';

describe('Checkout Receipt Page Container', () => {
  let component: CheckoutReceiptPageContainerComponent;
  let fixture: ComponentFixture<CheckoutReceiptPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutReceiptPageContainerComponent,
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
        MockComponent({
          selector: 'ish-checkout-receipt',
          template: 'Checkout Receipt Component',
          inputs: ['order', 'user'],
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
    fixture = TestBed.createComponent(CheckoutReceiptPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
