import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { spy, verify } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { BasketApproval } from 'ish-core/models/basket-approval/basket-approval.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketApprovalInfoComponent } from 'ish-shared/components/basket/basket-approval-info/basket-approval-info.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketMerchantMessageViewComponent } from 'ish-shared/components/basket/basket-merchant-message-view/basket-merchant-message-view.component';
import { BasketShippingMethodComponent } from 'ish-shared/components/basket/basket-shipping-method/basket-shipping-method.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { BasketCustomFieldsViewComponent } from 'ish-shared/components/checkout/basket-custom-fields-view/basket-custom-fields-view.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';

import { CheckoutReviewTacFieldComponent } from '../formly/checkout-review-tac-field/checkout-review-tac-field.component';

import { CheckoutReviewComponent } from './checkout-review.component';

describe('Checkout Review Component', () => {
  let component: CheckoutReviewComponent;
  let fixture: ComponentFixture<CheckoutReviewComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CheckoutReviewComponent,
        CheckoutReviewTacFieldComponent,
        MockComponent(AddressComponent),
        MockComponent(BasketApprovalInfoComponent),
        MockComponent(BasketCostSummaryComponent),
        MockComponent(BasketCustomFieldsViewComponent),
        MockComponent(BasketMerchantMessageViewComponent),
        MockComponent(BasketShippingMethodComponent),
        MockComponent(BasketValidationResultsComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(InfoBoxComponent),
        MockComponent(LineItemListComponent),
        MockComponent(ModalDialogLinkComponent),
        MockDirective(ServerHtmlDirective),
        MockPipe(ServerSettingPipe, path => path === 'shipping.messageToMerchant'),
      ],
      imports: [
        FeatureToggleModule.forTesting(),
        FormlyModule.forRoot({
          types: [{ name: 'ish-checkout-review-tac-field', component: CheckoutReviewTacFieldComponent }],
        }),
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReviewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.basket = BasketMockData.getBasket();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit an event if t&c checkbox is checked', () => {
    const emitter = spy(component.createOrder);

    fixture.detectChanges();

    const form = component.form as UntypedFormGroup;

    form.get('termsAndConditions').setValue('true');
    component.submitOrder();
    verify(emitter.emit()).once();
  });

  it('should not emit an event if t&c checkbox is empty', () => {
    const emitter = spy(component.createOrder);

    fixture.detectChanges();
    component.submitOrder();
    verify(emitter.emit()).never();
  });

  it('should display a message if an error occurs', () => {
    component.error = makeHttpError({ status: 400, message: 'Bad request' });
    fixture.detectChanges();
    expect(element.querySelector('ish-error-message')).toBeTruthy();
  });

  it('should display an approval required link if necessary', () => {
    component.basket.approval = {} as BasketApproval;
    fixture.detectChanges();
    expect(element.querySelector('ish-basket-approval-info')).toBeTruthy();
  });

  it('should display standard elements by default', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      [
        "ish-modal-dialog-link",
        "ish-error-message",
        "ish-basket-validation-results",
        "ish-basket-merchant-message-view",
        "ish-basket-custom-fields-view",
        "ish-info-box",
        "ish-address",
        "ish-info-box",
        "ish-address",
        "ish-info-box",
        "ish-basket-shipping-method",
        "ish-info-box",
        "ish-line-item-list",
        "ish-basket-cost-summary",
        "formly-form",
        "formly-field",
        "formly-group",
        "formly-field",
        "ish-checkout-review-tac-field",
      ]
    `);
  });
});
