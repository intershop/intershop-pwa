import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { checkoutReducers } from 'ish-core/store/checkout/checkout.system';
import { MockComponent } from '../../utils/dev/mock.component';

import { CheckoutReviewPageContainerComponent } from './checkout-review-page.container';

describe('Checkout Review Page Container', () => {
  let component: CheckoutReviewPageContainerComponent;
  let fixture: ComponentFixture<CheckoutReviewPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutReviewPageContainerComponent,
        MockComponent({
          selector: 'ish-checkout-review',
          template: 'Checkout Review Component',
          inputs: ['basket', 'error'],
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
    fixture = TestBed.createComponent(CheckoutReviewPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
