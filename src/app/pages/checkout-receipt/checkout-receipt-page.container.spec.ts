import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { checkoutReducers } from 'ish-core/store/checkout/checkout-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { CheckoutReceiptPageContainerComponent } from './checkout-receipt-page.container';
import { CheckoutReceiptComponent } from './components/checkout-receipt/checkout-receipt.component';

describe('Checkout Receipt Page Container', () => {
  let component: CheckoutReceiptPageContainerComponent;
  let fixture: ComponentFixture<CheckoutReceiptPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutReceiptPageContainerComponent,
        MockComponent(CheckoutReceiptComponent),
        MockComponent(LoadingComponent),
      ],
      imports: [
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            checkout: combineReducers(checkoutReducers),
          },
        }),
      ],
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
