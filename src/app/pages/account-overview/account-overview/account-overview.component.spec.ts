import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { LazyBudgetWidgetComponent } from 'organization-management';
import { LazyRequisitionWidgetComponent } from 'requisition-management';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { RoleToggleModule } from 'ish-core/role-toggle.module';
import { OrderWidgetComponent } from 'ish-shared/components/order/order-widget/order-widget.component';

import { LazyOrderTemplateWidgetComponent } from '../../../extensions/order-templates/exports/lazy-order-template-widget/lazy-order-template-widget.component';
import { LazyWishlistWidgetComponent } from '../../../extensions/wishlists/exports/lazy-wishlist-widget/lazy-wishlist-widget.component';

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
      declarations: [
        AccountOverviewComponent,
        MockComponent(FaIconComponent),
        MockComponent(LazyBudgetWidgetComponent),
        MockComponent(LazyOrderTemplateWidgetComponent),
        MockComponent(LazyRequisitionWidgetComponent),
        MockComponent(LazyWishlistWidgetComponent),
        MockComponent(OrderWidgetComponent),
        MockDirective(AuthorizationToggleDirective),
        MockDirective(ServerHtmlDirective),
        MockPipe(ServerSettingPipe, () => true),
      ],
      imports: [FeatureToggleModule.forTesting(), RoleToggleModule.forTesting(), TranslateModule.forRoot()],
    }).compileComponents();
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
    expect(element.querySelectorAll('div.circle-icon fa-icon')).toHaveLength(3);
  });

  it('should render order widget component on page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-order-widget')).toBeTruthy();
  });
});
