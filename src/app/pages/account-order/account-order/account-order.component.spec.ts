import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink, provideRouter } from '@angular/router';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureToggleDirective, FeatureToggleModule } from 'ish-core/feature-toggle.imports';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketBuyerComponent } from 'ish-shared/components/basket/basket-buyer/basket-buyer.component';
import { BasketCostCenterViewComponent } from 'ish-shared/components/basket/basket-cost-center-view/basket-cost-center-view.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketMerchantMessageViewComponent } from 'ish-shared/components/basket/basket-merchant-message-view/basket-merchant-message-view.component';
import { BasketShippingMethodComponent } from 'ish-shared/components/basket/basket-shipping-method/basket-shipping-method.component';
import { BasketCustomFieldsViewComponent } from 'ish-shared/components/checkout/basket-custom-fields-view/basket-custom-fields-view.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';

import { OrderCreateOrderTemplateComponent } from '../../../extensions/order-templates/shared/order-create-order-template/order-create-order-template.component';
import { AccountOrderToBasketComponent } from '../account-order-to-basket/account-order-to-basket.component';

import { AccountOrderComponent } from './account-order.component';

describe('Account Order Component', () => {
  let component: AccountOrderComponent;
  let fixture: ComponentFixture<AccountOrderComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountOrderComponent],
      providers: [
        ...(FeatureToggleModule.forTesting('orderTemplates').providers ?? []),
        provideRouter([]),
        provideTranslateService(),
      ],
    })
      .overrideComponent(AccountOrderComponent, {
        set: {
          imports: [
            MockComponent(AccountOrderToBasketComponent),
            MockPipe(DatePipe),
            TranslatePipe,
            MockDirective(ServerHtmlDirective),
            FeatureToggleDirective,
            MockComponent(InfoBoxComponent),
            MockComponent(BasketBuyerComponent),
            MockComponent(BasketCostCenterViewComponent),
            MockComponent(BasketCustomFieldsViewComponent),
            MockPipe(ServerSettingPipe, path => path === 'shipping.messageToMerchant'),
            MockComponent(BasketMerchantMessageViewComponent),
            MockComponent(AddressComponent),
            MockComponent(BasketShippingMethodComponent),
            MockComponent(LineItemListComponent),
            MockComponent(BasketCostSummaryComponent),
            OrderCreateOrderTemplateComponent,
            RouterLink,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOrderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.order = BasketMockData.getOrder();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered without errors if order details are incomplete', () => {
    component.order = {} as typeof component.order;
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render order details for the given order', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=order-summary-info]')).toBeTruthy();
    expect(element.querySelectorAll('ish-info-box')).toHaveLength(4);
    expect(element.querySelector('ish-line-item-list')).toBeTruthy();
    expect(element.querySelector('ish-basket-cost-summary')).toBeTruthy();
    expect(element.querySelector('ish-basket-merchant-message-view')).toBeTruthy();
  });

  it('should display the home link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="home-link"]')).toBeTruthy();
  });

  it('should display the order list link after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="orders-link"]')).toBeTruthy();
  });

  it('should display the create cart from order button after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-account-order-to-basket')).toBeTruthy();
  });

  it('should not eagerly render the deferred order-template button', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-order-create-order-template')).toBeFalsy();
  });
});
