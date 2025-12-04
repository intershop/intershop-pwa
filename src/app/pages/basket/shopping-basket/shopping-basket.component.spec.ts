import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { AuthorizationToggleDirective, AuthorizationToggleModule } from 'ish-core/authorization-toggle.imports';
import { LazyLoadingContentDirective } from 'ish-core/directives/lazy-loading-content.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureToggleDirective, FeatureToggleModule } from 'ish-core/feature-toggle.imports';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { NotRoleToggleDirective, RoleToggleModule } from 'ish-core/role-toggle.imports';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { BasketCostCenterSelectionComponent } from 'ish-shared/components/basket/basket-cost-center-selection/basket-cost-center-selection.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketCustomFieldsComponent } from 'ish-shared/components/basket/basket-custom-fields/basket-custom-fields.component';
import { BasketErrorMessageComponent } from 'ish-shared/components/basket/basket-error-message/basket-error-message.component';
import { BasketInfoComponent } from 'ish-shared/components/basket/basket-info/basket-info.component';
import { BasketPromotionCodeComponent } from 'ish-shared/components/basket/basket-promotion-code/basket-promotion-code.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { ClearBasketComponent } from 'ish-shared/components/basket/clear-basket/clear-basket.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';

import { BasketCreateOrderTemplateComponent } from '../../../extensions/order-templates/shared/basket-create-order-template/basket-create-order-template.component';
import { PunchoutTransferBasketComponent } from '../../../extensions/punchout/shared/punchout-transfer-basket/punchout-transfer-basket.component';
import { DirectOrderComponent } from '../../../extensions/quickorder/shared/direct-order/direct-order.component';
import { BasketAddToQuoteComponent } from '../../../extensions/quoting/shared/basket-add-to-quote/basket-add-to-quote.component';
import { QuotingBasketLineItemsComponent } from '../../../extensions/quoting/shared/quoting-basket-line-items/quoting-basket-line-items.component';
import { BasketOrderRecurrenceEditComponent } from '../basket-order-recurrence-edit/basket-order-recurrence-edit.component';
import { ShoppingBasketPaymentComponent } from '../shopping-basket-payment/shopping-basket-payment.component';

import { ShoppingBasketComponent } from './shopping-basket.component';

describe('Shopping Basket Component', () => {
  let component: ShoppingBasketComponent;
  let fixture: ComponentFixture<ShoppingBasketComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingBasketComponent, TranslateModule.forRoot()],
      providers: [
        ...(AuthorizationToggleModule.forTesting().providers ?? []),
        ...(FeatureToggleModule.forTesting().providers ?? []),
        ...(RoleToggleModule.forTesting().providers ?? []),
      ],
    })
      .overrideComponent(ShoppingBasketComponent, {
        set: {
          imports: [
            MockComponent(ContentIncludeComponent),
            TranslatePipe,
            MockComponent(ModalDialogLinkComponent),
            MockComponent(BasketErrorMessageComponent),
            MockComponent(BasketInfoComponent),
            MockComponent(BasketValidationResultsComponent),
            MockDirective(ServerHtmlDirective),
            MockComponent(BasketCostCenterSelectionComponent),
            MockComponent(BasketCustomFieldsComponent),
            MockComponent(SkipContentLinkComponent),
            FeatureToggleDirective,
            MockComponent(BasketAddToQuoteComponent),
            MockComponent(BasketCreateOrderTemplateComponent),
            MockComponent(LineItemListComponent),
            MockComponent(LoadingComponent),
            MockComponent(ClearBasketComponent),
            MockComponent(DirectOrderComponent),
            MockComponent(BasketPromotionCodeComponent),
            MockComponent(BasketCostSummaryComponent),
            MockComponent(BasketOrderRecurrenceEditComponent),
            MockComponent(PunchoutTransferBasketComponent),
            MockComponent(QuotingBasketLineItemsComponent),
            MockPipe(ServerSettingPipe),
            NotRoleToggleDirective,
            MockComponent(ShoppingBasketPaymentComponent),
            MockDirective(LazyLoadingContentDirective),
            AuthorizationToggleDirective,
          ],
        },
      })
      .compileComponents();
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
    expect(element.querySelector('ish-basket-error-message')).toBeTruthy();
  });
});
