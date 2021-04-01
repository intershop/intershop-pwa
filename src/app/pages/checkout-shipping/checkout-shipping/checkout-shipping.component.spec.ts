import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { anything, capture, spy, verify } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { BasketAddressSummaryComponent } from 'ish-shared/components/basket/basket-address-summary/basket-address-summary.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketItemsSummaryComponent } from 'ish-shared/components/basket/basket-items-summary/basket-items-summary.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { CheckoutShippingComponent } from './checkout-shipping.component';

describe('Checkout Shipping Component', () => {
  let component: CheckoutShippingComponent;
  let fixture: ComponentFixture<CheckoutShippingComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CheckoutShippingComponent,
        MockComponent(BasketAddressSummaryComponent),
        MockComponent(BasketCostSummaryComponent),
        MockComponent(BasketItemsSummaryComponent),
        MockComponent(BasketValidationResultsComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(NgbPopover),
        MockDirective(ServerHtmlDirective),
        MockPipe(PricePipe),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutShippingComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
    component.shippingMethods = [BasketMockData.getShippingMethod()];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render available shipping methods on page', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('div.radio')).toHaveLength(1);
  });

  it('should not render an error if no error occurs', () => {
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeFalsy();
  });

  it('should render an error if an error occurs', () => {
    component.error = makeHttpError({ status: 404 });
    fixture.detectChanges();
    expect(element.querySelector('ish-error-message')).toBeTruthy();
  });

  it('should not render an error if the user has currently no shipping method selected', () => {
    component.basket.commonShippingMethod = undefined;
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeFalsy();
  });

  it('should render an error if the user clicks next and has currently no shipping method selected', () => {
    component.basket.commonShippingMethod = undefined;
    component.goToNextStep();
    fixture.detectChanges();
    expect(element.querySelector('[role="alert"]')).toBeTruthy();
  });

  it('should throw updateShippingMethod event when the user changes payment selection', () => {
    fixture.detectChanges();

    const emitter = spy(component.updateShippingMethod);

    component.shippingForm.get('id').setValue('testShipping');

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`"testShipping"`);
  });

  it('should set submitted if next button is clicked', () => {
    expect(component.submitted).toBeFalse();
    component.goToNextStep();
    expect(component.submitted).toBeTrue();
  });

  it('should not disable next button if basket shipping method is set and next button is clicked', () => {
    expect(component.nextDisabled).toBeFalse();
    component.goToNextStep();
    expect(component.nextDisabled).toBeFalse();
  });

  it('should disable next button if basket shipping method is missing and next button is clicked', () => {
    component.basket.commonShippingMethod = undefined;

    component.goToNextStep();
    expect(component.nextDisabled).toBeTrue();
  });
});
