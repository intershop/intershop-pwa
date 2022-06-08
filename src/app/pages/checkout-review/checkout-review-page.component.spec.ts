import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CheckoutReviewPageComponent } from './checkout-review-page.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';

describe('Checkout Review Page Component', () => {
  let component: CheckoutReviewPageComponent;
  let fixture: ComponentFixture<CheckoutReviewPageComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    accountFacade = mock(AccountFacade);
    await TestBed.configureTestingModule({
      declarations: [
        CheckoutReviewPageComponent,
        MockComponent(CheckoutReviewComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReviewPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(checkoutFacade.basketLoading$).thenReturn(of(true));
    when(checkoutFacade.basket$).thenReturn(EMPTY);
    when(checkoutFacade.basketOrOrdersError$).thenReturn(EMPTY);
    when(accountFacade.ordersLoading$).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
