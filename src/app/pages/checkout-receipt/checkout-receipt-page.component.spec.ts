import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { CheckoutReceiptRequisitionComponent } from 'requisition-management';
import { instance, mock } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CheckoutReceiptOrderComponent } from './checkout-receipt-order/checkout-receipt-order.component';
import { CheckoutReceiptPageComponent } from './checkout-receipt-page.component';
import { CheckoutReceiptComponent } from './checkout-receipt/checkout-receipt.component';

describe('Checkout Receipt Page Component', () => {
  let component: CheckoutReceiptPageComponent;
  let fixture: ComponentFixture<CheckoutReceiptPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutReceiptPageComponent],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(mock(CheckoutFacade)) }],
    })
      .overrideComponent(CheckoutReceiptPageComponent, {
        remove: {
          imports: [
            CheckoutReceiptComponent,
            LoadingComponent,
            CheckoutReceiptOrderComponent,
            CheckoutReceiptRequisitionComponent,
          ],
        },
        add: {
          imports: [
            MockComponent(CheckoutReceiptComponent),
            MockComponent(LoadingComponent),
            MockComponent(CheckoutReceiptOrderComponent),
            MockComponent(CheckoutReceiptRequisitionComponent),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReceiptPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
