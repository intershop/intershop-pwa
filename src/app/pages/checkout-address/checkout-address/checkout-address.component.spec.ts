import { Component } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketItemsSummaryComponent } from 'ish-shared/components/basket/basket-items-summary/basket-items-summary.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { BasketInvoiceAddressWidgetComponent } from 'ish-shared/components/checkout/basket-invoice-address-widget/basket-invoice-address-widget.component';
import { BasketShippingAddressWidgetComponent } from 'ish-shared/components/checkout/basket-shipping-address-widget/basket-shipping-address-widget.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

import { CheckoutAddressComponent } from './checkout-address.component';

describe('Checkout Address Component', () => {
  let component: CheckoutAddressComponent;
  let fixture: ComponentFixture<CheckoutAddressComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [
        CheckoutAddressComponent,
        DummyComponent,
        MockComponent(BasketCostSummaryComponent),
        MockComponent(BasketInvoiceAddressWidgetComponent),
        MockComponent(BasketItemsSummaryComponent),
        MockComponent(BasketShippingAddressWidgetComponent),
        MockComponent(BasketValidationResultsComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(ModalDialogLinkComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [
        NgbCollapseModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: 'checkout/shipping', component: DummyComponent }]),
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAddressComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render invoiceToAddress and ShipToAddress widgets if set', () => {
    fixture.detectChanges();
    expect(element.querySelector('div[data-testing-id=invoiceToAddress]')).toBeTruthy();
    expect(element.querySelector('div[data-testing-id=shipToAddress]')).toBeTruthy();
  });

  it('should not render address forms after creation', () => {
    fixture.detectChanges();
    expect(
      element.querySelector('div.show[data-testing-id=invoice-address-form] ish-checkout-address-form')
    ).toBeFalsy();
    expect(
      element.querySelector('div.show[data-testing-id=shipping-address-form] ish-checkout-address-form')
    ).toBeFalsy();
  });

  it('should render cart summary components after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-basket-items-summary')).toBeTruthy();
    expect(element.querySelector('ish-basket-cost-summary')).toBeTruthy();
  });

  it('should not render an error if no error occurs', () => {
    component.error = undefined;
    fixture.detectChanges();
    expect(element.querySelector('ish-error-message')).toBeFalsy();
  });

  it('should render an error if an error occurs', () => {
    component.error = makeHttpError({ status: 404 });
    fixture.detectChanges();
    expect(element.querySelector('ish-error-message')).toBeTruthy();
  });

  it('should not render an error if the user has currently no addresses selected', () => {
    component.basket.invoiceToAddress = undefined;
    component.basket.commonShipToAddress = undefined;
    fixture.detectChanges();
    expect(element.querySelector('div.alert-danger')).toBeFalsy();
  });

  it('should render an error if the user clicks next and has currently no addresses selected', () => {
    component.basket.invoiceToAddress = undefined;
    component.basket.commonShipToAddress = undefined;
    component.goToNextStep();
    fixture.detectChanges();
    expect(element.querySelector('div.alert-danger')).toBeTruthy();
  });

  it('should set submitted if next button is clicked', () => {
    expect(component.submitted).toBeFalse();
    component.goToNextStep();
    expect(component.submitted).toBeTrue();
  });

  it('should not disable next button if basket addresses are set and next button is clicked', () => {
    expect(component.nextDisabled).toBeFalse();
    component.goToNextStep();
    expect(component.nextDisabled).toBeFalse();
  });

  it('should disable next button if basket invoice is missing and next button is clicked', () => {
    component.basket.invoiceToAddress = undefined;

    component.goToNextStep();
    expect(component.nextDisabled).toBeTrue();
  });

  it('should disable next button if basket shipping is missing and next button is clicked', () => {
    component.basket.commonShipToAddress = undefined;

    component.goToNextStep();
    expect(component.nextDisabled).toBeTrue();
  });
});
