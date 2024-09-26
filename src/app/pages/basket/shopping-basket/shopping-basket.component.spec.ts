import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { RoleToggleModule } from 'ish-core/role-toggle.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { BasketCostCenterSelectionComponent } from 'ish-shared/components/basket/basket-cost-center-selection/basket-cost-center-selection.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketErrorMessageComponent } from 'ish-shared/components/basket/basket-error-message/basket-error-message.component';
import { BasketInfoComponent } from 'ish-shared/components/basket/basket-info/basket-info.component';
import { BasketPromotionCodeComponent } from 'ish-shared/components/basket/basket-promotion-code/basket-promotion-code.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { ClearBasketComponent } from 'ish-shared/components/basket/clear-basket/clear-basket.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';

import { LazyBasketCreateOrderTemplateComponent } from '../../../extensions/order-templates/exports/lazy-basket-create-order-template/lazy-basket-create-order-template.component';
import { LazyDirectOrderComponent } from '../../../extensions/quickorder/exports/lazy-direct-order/lazy-direct-order.component';
import { LazyBasketAddToQuoteComponent } from '../../../extensions/quoting/exports/lazy-basket-add-to-quote/lazy-basket-add-to-quote.component';
import { ShoppingBasketPaymentComponent } from '../shopping-basket-payment/shopping-basket-payment.component';

import { ShoppingBasketComponent } from './shopping-basket.component';

describe('Shopping Basket Component', () => {
  let component: ShoppingBasketComponent;
  let fixture: ComponentFixture<ShoppingBasketComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(BasketCostCenterSelectionComponent),
        MockComponent(BasketCostSummaryComponent),
        MockComponent(BasketErrorMessageComponent),
        MockComponent(BasketInfoComponent),
        MockComponent(BasketPromotionCodeComponent),
        MockComponent(BasketValidationResultsComponent),
        MockComponent(ClearBasketComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(LazyBasketAddToQuoteComponent),
        MockComponent(LazyBasketCreateOrderTemplateComponent),
        MockComponent(LazyDirectOrderComponent),
        MockComponent(LineItemListComponent),
        MockComponent(ModalDialogLinkComponent),
        MockComponent(ShoppingBasketPaymentComponent),
        MockPipe(ServerSettingPipe),
        ShoppingBasketComponent,
      ],
      imports: [
        AuthorizationToggleModule.forTesting(),
        FeatureToggleModule.forTesting(),
        RoleToggleModule.forTesting(),
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingBasketComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();
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
    component.error = makeHttpError({ status: 404, message: 'error message' });
    fixture.detectChanges();
    expect(element.querySelector('ish-error-message')).toBeTruthy();
  });
});
