import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { BasketAddressSummaryComponent } from 'ish-shared/components/basket/basket-address-summary/basket-address-summary.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketDesiredDeliveryDateComponent } from 'ish-shared/components/basket/basket-desired-delivery-date/basket-desired-delivery-date.component';
import { BasketErrorMessageComponent } from 'ish-shared/components/basket/basket-error-message/basket-error-message.component';
import { BasketItemsSummaryComponent } from 'ish-shared/components/basket/basket-items-summary/basket-items-summary.component';
import { BasketMerchantMessageComponent } from 'ish-shared/components/basket/basket-merchant-message/basket-merchant-message.component';
import { BasketOrderReferenceComponent } from 'ish-shared/components/basket/basket-order-reference/basket-order-reference.component';
import { BasketRecurrenceSummaryComponent } from 'ish-shared/components/basket/basket-recurrence-summary/basket-recurrence-summary.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { CheckoutShippingPageComponent } from './checkout-shipping-page.component';
import { CheckoutShippingComponent } from './checkout-shipping/checkout-shipping.component';

describe('Checkout Shipping Page Component', () => {
  let component: CheckoutShippingPageComponent;
  let fixture: ComponentFixture<CheckoutShippingPageComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    await TestBed.configureTestingModule({
      imports: [CheckoutShippingPageComponent],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        provideTranslateService(),
      ],
    })
      .overrideComponent(CheckoutShippingPageComponent, {
        set: {
          imports: [
            AsyncPipe,
            MockComponent(BasketAddressSummaryComponent),
            MockComponent(BasketCostSummaryComponent),
            MockComponent(BasketDesiredDeliveryDateComponent),
            MockComponent(BasketErrorMessageComponent),
            MockComponent(BasketItemsSummaryComponent),
            MockComponent(BasketMerchantMessageComponent),
            MockComponent(BasketOrderReferenceComponent),
            MockComponent(BasketRecurrenceSummaryComponent),
            MockComponent(BasketValidationResultsComponent),
            MockComponent(CheckoutShippingComponent),
            MockComponent(LoadingComponent),
            MockDirective(ServerHtmlDirective),
            MockPipe(ServerSettingPipe, path => path === 'shipping.messageToMerchant'),
            TranslatePipe,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutShippingPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
    when(checkoutFacade.basketLoading$).thenReturn(of(false));
    when(checkoutFacade.eligibleShippingMethods$()).thenReturn(of([BasketMockData.getShippingMethod()]));
    when(checkoutFacade.isDesiredDeliveryDateEnabled$).thenReturn(of(false));
    when(checkoutFacade.basketError$).thenReturn(of(undefined));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render an error if no error occurs', () => {
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeFalsy();
  });
  it('should render an error if an error occurs', () => {
    when(checkoutFacade.basketError$).thenReturn(of(makeHttpError({ status: 404 })));
    fixture.detectChanges();
    expect(element.querySelector('ish-basket-error-message')).toBeTruthy();
  });

  it('should not render an error if the user has currently no shipping method selected', () => {
    when(checkoutFacade.basket$).thenReturn(of({ ...BasketMockData.getBasket(), commonShippingMethod: undefined }));
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeFalsy();
  });

  it('should render an error if the user clicks next and has currently no shipping method selected', () => {
    when(checkoutFacade.basket$).thenReturn(of({ ...BasketMockData.getBasket(), commonShippingMethod: undefined }));

    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')).toBeFalsy();

    component.goToNextStep();
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')).toBeTruthy();
  });

  it('should continue checkout if selection is valid', fakeAsync(() => {
    fixture.detectChanges();

    component.goToNextStep();
    tick(100);
    verify(checkoutFacade.continue(anything())).once();
  }));

  it('should not disable next button if basket shipping method is set and next button is clicked', fakeAsync(() => {
    fixture.detectChanges();

    expect(component.nextDisabled).toBeFalse();
    component.goToNextStep();
    tick(100);
    expect(component.nextDisabled).toBeFalse();
  }));

  it('should disable next button if basket shipping method is missing and next button is clicked', fakeAsync(() => {
    when(checkoutFacade.basket$).thenReturn(of({ ...BasketMockData.getBasket(), commonShippingMethod: undefined }));
    fixture.detectChanges();

    component.goToNextStep();
    tick(100);
    expect(component.nextDisabled).toBeTrue();
  }));

  it('should render shipping component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-checkout-shipping')).toBeTruthy();
  });

  it('should render message to merchant component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-basket-merchant-message')).toBeTruthy();
  });
});
