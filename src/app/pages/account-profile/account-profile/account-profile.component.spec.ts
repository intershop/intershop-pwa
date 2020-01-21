import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { User } from 'ish-core/models/user/user.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';

import { AccountProfileComponent } from './account-profile.component';

describe('Account Profile Component', () => {
  let component: AccountProfileComponent;
  let fixture: ComponentFixture<AccountProfileComponent>;
  let element: HTMLElement;
  let locales: Locale[];

  const user = { firstName: 'Patricia', lastName: 'Miller', email: 'patricia@test.intershop.de' } as User;
  const customer = { type: 'PrivateCustomer' } as Customer;

  beforeEach(async(() => {
    locales = [
      { lang: 'en_US', currency: 'USD', value: 'en' },
      { lang: 'de_DE', currency: 'EUR', value: 'de' },
    ] as Locale[];

    TestBed.configureTestingModule({
      declarations: [
        AccountProfileComponent,
        MockComponent(FaIconComponent),
        MockDirective(ServerHtmlDirective),
        MockPipe(DatePipe),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: AVAILABLE_LOCALES, useValue: locales }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.user = user;
    component.customer = customer;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display customer data and edit links after creation ', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="email-field"]').innerHTML).toBe('patricia@test.intershop.de');
    expect(element.querySelector('[data-testing-id="edit-email"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="edit-password"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="edit-user"]')).toBeTruthy();

    expect(element.querySelector('[data-testing-id="company-info"]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id="edit-company"]')).toBeFalsy();
  });

  it('should display company section and link for a business customer ', () => {
    component.customer = { type: 'SMBCustomer', isBusinessCustomer: true } as Customer;
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="company-info"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="edit-company"]')).toBeTruthy();
  });
});
