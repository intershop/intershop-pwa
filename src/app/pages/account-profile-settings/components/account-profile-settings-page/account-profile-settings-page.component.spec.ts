import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { Customer } from 'ish-core/models/customer/customer.model';
import { User } from 'ish-core/models/user/user.model';
import { PipesModule } from 'ish-core/pipes.module';

import { AccountProfileSettingsPageComponent } from './account-profile-settings-page.component';

describe('Account Profile Settings Page Component', () => {
  let component: AccountProfileSettingsPageComponent;
  let fixture: ComponentFixture<AccountProfileSettingsPageComponent>;
  let element: HTMLElement;
  const user = { firstName: 'Patricia', lastName: 'Miller', email: 'patricia@test.intershop.de' } as User;
  const customer = { type: 'PrivateCustomer' } as Customer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountProfileSettingsPageComponent],
      imports: [IconModule, PipesModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileSettingsPageComponent);
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
    expect(element.querySelector('[data-testing-id="success-message"]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id="email-field"]').innerHTML).toBe('patricia@test.intershop.de');
    expect(element.querySelector('[data-testing-id="edit-email"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="edit-password"]')).toBeTruthy();
  });
  it('should show a success message if the input parameter successMessage is set', () => {
    component.successMessage = 'success';
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="success-message"]')).toBeTruthy();
  });
});
