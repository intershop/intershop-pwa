import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { IdentityProviderCapabilityDirective } from 'ish-core/directives/identity-provider-capability.directive';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { IdentityProviderModule } from 'ish-core/identity-provider.module';
import { User } from 'ish-core/models/user/user.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';

import { AccountProfileComponent } from './account-profile.component';

describe('Account Profile Component', () => {
  let component: AccountProfileComponent;
  let fixture: ComponentFixture<AccountProfileComponent>;
  let element: HTMLElement;

  const user = { firstName: 'Patricia', lastName: 'Miller', email: 'patricia@test.intershop.de' } as User;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountProfileComponent,
        IdentityProviderCapabilityDirective,
        MockComponent(FaIconComponent),
        MockDirective(ServerHtmlDirective),
        MockPipe(ServerSettingPipe, () => true),
      ],
      imports: [
        AuthorizationToggleModule.forTesting('APP_B2B_MANAGE_USERS'),
        IdentityProviderModule.forTesting(),
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProfileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.user = user;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display customer data and edit links after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="email-field"]').innerHTML).toBe('patricia@test.intershop.de');
    expect(element.querySelector('[data-testing-id="edit-email"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="edit-password"]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id="edit-user"]')).toBeTruthy();

    expect(element.querySelector('[data-testing-id="company-info"]')).toBeFalsy();
    expect(element.querySelector('[data-testing-id="edit-company"]')).toBeFalsy();
  });

  it('should display newsletter subscription status when the newsletter feature is enabled', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="newsletter-info"]')).toBeTruthy();
  });
});
