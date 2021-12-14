import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, UrlSegment, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { LazyCheckoutReceiptRequisitionComponent } from 'requisition-management';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CheckoutReceiptOrderComponent } from './checkout-receipt-order/checkout-receipt-order.component';
import { CheckoutReceiptPageComponent } from './checkout-receipt-page.component';
import { CheckoutReceiptComponent } from './checkout-receipt/checkout-receipt.component';

describe('Checkout Receipt Page Component', () => {
  let component: CheckoutReceiptPageComponent;
  let fixture: ComponentFixture<CheckoutReceiptPageComponent>;
  let element: HTMLElement;
  let activatedRoute: ActivatedRoute;
  const checkoutFacade = mock(CheckoutFacade);

  beforeEach(async () => {
    activatedRoute = mock(ActivatedRoute);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        CheckoutReceiptPageComponent,
        MockComponent(CheckoutReceiptComponent),
        MockComponent(CheckoutReceiptOrderComponent),
        MockComponent(LazyCheckoutReceiptRequisitionComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [
        { provide: ActivatedRoute, useFactory: () => instance(activatedRoute) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
      ],
    }).compileComponents();

    when(activatedRoute.snapshot).thenReturn({
      queryParamMap: convertToParamMap({ order: '12345' }),
      url: [{ path: '/checkout' } as UrlSegment, { path: 'receipt' } as UrlSegment],
    } as ActivatedRouteSnapshot);
    when(checkoutFacade.selectedOrder$).thenReturn(EMPTY);
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
