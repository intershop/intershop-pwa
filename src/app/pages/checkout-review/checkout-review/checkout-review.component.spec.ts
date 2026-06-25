import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { FormlyForm, FormlyModule } from '@ngx-formly/core';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, spy, verify, when } from 'ts-mockito';

import { LazyLoadingContentDirective } from 'ish-core/directives/lazy-loading-content.directive';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { FeatureToggleDirective } from 'ish-core/feature-toggle.imports';
import { BasketApproval } from 'ish-core/models/basket-approval/basket-approval.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketApprovalInfoComponent } from 'ish-shared/components/basket/basket-approval-info/basket-approval-info.component';
import { BasketBuyerComponent } from 'ish-shared/components/basket/basket-buyer/basket-buyer.component';
import { BasketCostCenterViewComponent } from 'ish-shared/components/basket/basket-cost-center-view/basket-cost-center-view.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketErrorMessageComponent } from 'ish-shared/components/basket/basket-error-message/basket-error-message.component';
import { BasketMerchantMessageViewComponent } from 'ish-shared/components/basket/basket-merchant-message-view/basket-merchant-message-view.component';
import { BasketShippingMethodComponent } from 'ish-shared/components/basket/basket-shipping-method/basket-shipping-method.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { BasketCustomFieldsViewComponent } from 'ish-shared/components/checkout/basket-custom-fields-view/basket-custom-fields-view.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';
import { OrderRecurrenceComponent } from 'ish-shared/components/order/order-recurrence/order-recurrence.component';

import { CheckoutReviewTacFieldComponent } from '../formly/checkout-review-tac-field/checkout-review-tac-field.component';

import { CheckoutReviewComponent } from './checkout-review.component';

const checkoutReviewTacFieldMockComponent = MockComponent(CheckoutReviewTacFieldComponent);

describe('Checkout Review Component', () => {
  let component: CheckoutReviewComponent;
  let fixture: ComponentFixture<CheckoutReviewComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    checkoutFacade = mock(CheckoutFacade);

    when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
    when(checkoutFacade.eligiblePaymentMethods$()).thenReturn(of([]));

    await TestBed.configureTestingModule({
      imports: [
        CheckoutReviewComponent,
        FormlyModule.forRoot({
          types: [{ name: 'ish-checkout-review-tac-field', component: checkoutReviewTacFieldMockComponent }],
        }),
      ],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
        provideTranslateService(),
      ],
    })
      .overrideComponent(CheckoutReviewComponent, {
        set: {
          imports: [
            TranslatePipe,
            MockComponent(ModalDialogLinkComponent),
            MockComponent(ContentIncludeComponent),
            MockDirective(LazyLoadingContentDirective),
            MockComponent(ErrorMessageComponent),
            MockComponent(BasketErrorMessageComponent),
            MockComponent(BasketValidationResultsComponent),
            MockComponent(BasketApprovalInfoComponent),
            MockComponent(BasketMerchantMessageViewComponent),
            MockPipe(ServerSettingPipe, path => path === 'shipping.messageToMerchant'),
            MockComponent(InfoBoxComponent),
            MockComponent(BasketBuyerComponent),
            FeatureToggleDirective,
            MockComponent(OrderRecurrenceComponent),
            MockComponent(AddressComponent),
            MockComponent(SkipContentLinkComponent),
            MockComponent(LineItemListComponent),
            MockComponent(BasketCostSummaryComponent),
            FormlyForm,
            ReactiveFormsModule,
            MockComponent(BasketShippingMethodComponent),
            MockComponent(BasketCostCenterViewComponent),
            MockComponent(BasketCustomFieldsViewComponent),
            AsyncPipe,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReviewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(appFacade.serverSetting$<boolean>('basket.termsAndConditions')).thenReturn(of(true));
    component.basket = { ...BasketMockData.getBasket(), costCenter: 'CC123' };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit an event if t&c are disabled', () => {
    when(appFacade.serverSetting$<boolean>('basket.termsAndConditions')).thenReturn(of(false));
    const emitter = spy(component.createOrder);

    fixture.detectChanges();
    component.submitOrder();
    verify(emitter.emit()).once();
  });

  it('should return empty fields array when t&c are disabled', done => {
    when(appFacade.serverSetting$<boolean>('basket.termsAndConditions')).thenReturn(of(false));

    fixture.detectChanges();

    component.fields$.subscribe(fields => {
      expect(fields).toBeEmpty();
      done();
    });
  });

  it('should emit an event if t&c checkbox is checked and t&c are enabled', () => {
    const emitter = spy(component.createOrder);

    fixture.detectChanges();

    const form = component.form as UntypedFormGroup;

    form.get('termsAndConditions').setValue('true');
    component.submitOrder();
    verify(emitter.emit()).once();
  });

  it('should not emit an event if t&c checkbox is empty and t&c are enabled', () => {
    const emitter = spy(component.createOrder);

    fixture.detectChanges();
    component.submitOrder();
    verify(emitter.emit()).never();
  });

  it('should return t&c fields when t&c are enabled', done => {
    when(appFacade.serverSetting$<boolean>('basket.termsAndConditions')).thenReturn(of(true));

    fixture.detectChanges();

    component.fields$.subscribe(fields => {
      expect(fields).toHaveLength(1);
      expect(fields[0].type).toBe('ish-checkout-review-tac-field');
      done();
    });
  });

  it('should display a message if an error occurs', () => {
    component.error = makeHttpError({ status: 400, message: 'Bad request' });
    fixture.detectChanges();
    expect(element.querySelector('ish-basket-error-message')).toBeTruthy();
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
        "ish-basket-validation-results",
        "ish-basket-merchant-message-view",
        "ish-info-box",
        "ish-basket-cost-center-view",
        "ish-basket-custom-fields-view",
        "ish-info-box",
        "ish-address",
        "ish-info-box",
        "ish-address",
        "ish-info-box",
        "ish-basket-shipping-method",
        "ish-info-box",
        "ish-skip-content-link",
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
