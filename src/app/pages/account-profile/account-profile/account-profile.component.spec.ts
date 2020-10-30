import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';

import { AccountProfileComponent } from './account-profile.component';

describe('Account Profile Component', () => {
  let component: AccountProfileComponent;
  let fixture: ComponentFixture<AccountProfileComponent>;
  let element: HTMLElement;

  const user = { firstName: 'Patricia', lastName: 'Miller', email: 'patricia@test.intershop.de' } as User;
  const customer = { isBusinessCustomer: false } as Customer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountProfileComponent, MockComponent(FaIconComponent), MockDirective(ServerHtmlDirective)],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

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
    component.customer = { isBusinessCustomer: true } as Customer;
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="company-info"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="edit-company"]')).toBeTruthy();
  });
});
