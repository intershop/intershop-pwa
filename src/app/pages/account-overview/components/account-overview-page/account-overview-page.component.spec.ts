import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { IconModule } from 'ish-core/icon.module';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { OrderWidgetComponent } from 'ish-shared/order/components/order-widget/order-widget.component';

import { LazyQuoteWidgetComponent } from '../../../../extensions/quoting/exports/account/components/lazy-quote-widget/lazy-quote-widget.component';

import { AccountOverviewPageComponent } from './account-overview-page.component';

describe('Account Overview Page Component', () => {
  let fixture: ComponentFixture<AccountOverviewPageComponent>;
  let component: AccountOverviewPageComponent;
  let element: HTMLElement;
  let translate: TranslateService;
  const user = { firstName: 'Patricia' } as User;
  const customer = { isBusinessCustomer: false } as Customer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountOverviewPageComponent,
        MockComponent(LazyQuoteWidgetComponent),
        MockComponent(OrderWidgetComponent),
      ],
      imports: [IconModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOverviewPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translate = TestBed.get(TranslateService);
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
