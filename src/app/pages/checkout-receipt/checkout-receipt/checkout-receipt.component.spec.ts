import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink, provideRouter } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { FeatureToggleDirective, FeatureToggleModule } from 'ish-core/feature-toggle.imports';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketBuyerComponent } from 'ish-shared/components/basket/basket-buyer/basket-buyer.component';
import { BasketCostCenterViewComponent } from 'ish-shared/components/basket/basket-cost-center-view/basket-cost-center-view.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketMerchantMessageViewComponent } from 'ish-shared/components/basket/basket-merchant-message-view/basket-merchant-message-view.component';
import { BasketShippingMethodComponent } from 'ish-shared/components/basket/basket-shipping-method/basket-shipping-method.component';
import { BasketCustomFieldsViewComponent } from 'ish-shared/components/checkout/basket-custom-fields-view/basket-custom-fields-view.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';
import { OrderRecurrenceComponent } from 'ish-shared/components/order/order-recurrence/order-recurrence.component';

import { CheckoutReceiptComponent } from './checkout-receipt.component';

describe('Checkout Receipt Component', () => {
  let component: CheckoutReceiptComponent;
  let fixture: ComponentFixture<CheckoutReceiptComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutReceiptComponent, TranslateModule.forRoot()],
      providers: [...(FeatureToggleModule.forTesting().providers ?? []), provideRouter([])],
    })
      .overrideComponent(CheckoutReceiptComponent, {
        set: {
          imports: [
            MockComponent(BasketMerchantMessageViewComponent),
            MockPipe(ServerSettingPipe, path => path === 'shipping.messageToMerchant'),
            FeatureToggleDirective,
            MockComponent(InfoBoxComponent),
            MockComponent(BasketBuyerComponent),
            MockComponent(OrderRecurrenceComponent),
            MockComponent(BasketShippingMethodComponent),
            MockComponent(AddressComponent),
            MockComponent(SkipContentLinkComponent),
            MockComponent(LineItemListComponent),
            TranslatePipe,
            MockComponent(BasketCostSummaryComponent),
            MockComponent(BasketCostCenterViewComponent),
            MockComponent(BasketCustomFieldsViewComponent),
            RouterLink,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReceiptComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.order = { ...BasketMockData.getOrder(), costCenter: 'CC123' };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the home link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="home-link"]')).toBeTruthy();
  });

  it('should display the my account link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="myaccount-link"]')).toBeTruthy();
  });

  it('should display standard elements by default', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      [
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
      ]
    `);
  });
});
