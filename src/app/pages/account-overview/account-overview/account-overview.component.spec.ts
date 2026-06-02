import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink, provideRouter } from '@angular/router';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { BudgetWidgetComponent, CostCenterWidgetComponent } from 'organization-management';
import { ApprovalWidgetComponent, RequisitionWidgetComponent } from 'requisition-management';

import { AuthorizationToggleDirective, AuthorizationToggleModule } from 'ish-core/authorization-toggle.imports';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureToggleDirective, FeatureToggleModule } from 'ish-core/feature-toggle.imports';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { HtmlEncodePipe } from 'ish-core/pipes/html-encode.pipe';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { NotRoleToggleDirective, RoleToggleModule } from 'ish-core/role-toggle.imports';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { OrderWidgetComponent } from 'ish-shared/components/order/order-widget/order-widget.component';

import { OrderTemplateWidgetComponent } from '../../../extensions/order-templates/shared/order-template-widget/order-template-widget.component';
import { QuoteWidgetComponent } from '../../../extensions/quoting/shared/quote-widget/quote-widget.component';
import { WishlistWidgetComponent } from '../../../extensions/wishlists/shared/wishlist-widget/wishlist-widget.component';

import { AccountOverviewComponent } from './account-overview.component';

describe('Account Overview Component', () => {
  let fixture: ComponentFixture<AccountOverviewComponent>;
  let component: AccountOverviewComponent;
  let element: HTMLElement;
  let translate: TranslateService;

  const user = { firstName: 'Patricia' } as User;
  const customer = { isBusinessCustomer: false } as Customer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountOverviewComponent, TranslateModule.forRoot()],
      providers: [
        ...(AuthorizationToggleModule.forTesting().providers ?? []),
        ...(FeatureToggleModule.forTesting().providers ?? []),
        ...(RoleToggleModule.forTesting().providers ?? []),
        provideRouter([]),
      ],
    })
      .overrideComponent(AccountOverviewComponent, {
        set: {
          imports: [
            AuthorizationToggleDirective,
            MockComponent(ContentIncludeComponent),
            MockDirective(ServerHtmlDirective),
            FeatureToggleDirective,
            MockComponent(OrderTemplateWidgetComponent),
            MockComponent(OrderWidgetComponent),
            MockComponent(BudgetWidgetComponent),
            MockComponent(CostCenterWidgetComponent),
            MockPipe(HtmlEncodePipe),
            MockPipe(ServerSettingPipe, () => true),
            MockComponent(QuoteWidgetComponent),
            MockComponent(RequisitionWidgetComponent),
            MockComponent(ApprovalWidgetComponent),
            NotRoleToggleDirective,
            TranslatePipe,
            MockComponent(WishlistWidgetComponent),
            RouterLink,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOverviewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.set('account.overview.personal_message.text', 'Hi, {{0}}.');
    component.user = user;
    component.customer = customer;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display user name when displaying personal text', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=personal-message-default]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=personal-message-default]').textContent).toContain(user.firstName);
  });

  it('should display special personal text for b2b customer', () => {
    const customerB2B = { isBusinessCustomer: true } as Customer;
    component.customer = customerB2B;
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=personal-message-b2b]')).toBeTruthy();
  });

  it('should display dashboard on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('.account-dashboard')).toBeTruthy();
    expect(element.querySelectorAll('div.circle-icon i.bi')).toHaveLength(3);
  });

  it('should render order widget component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-order-widget')).toBeTruthy();
  });
});
