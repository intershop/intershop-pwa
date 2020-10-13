import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { AccountUserInfoComponent } from '../account-user-info/account-user-info.component';

import { AccountNavigationComponent } from './account-navigation.component';

describe('Account Navigation Component', () => {
  let component: AccountNavigationComponent;
  let fixture: ComponentFixture<AccountNavigationComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountNavigationComponent, MockComponent(AccountUserInfoComponent)],
      imports: [
        AuthorizationToggleModule.forTesting('APP_B2B_MANAGE_USERS', 'APP_B2B_PURCHASE'),
        FeatureToggleModule.forTesting('quoting', 'orderTemplates'),
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display link to quote list', () => {
    fixture.detectChanges();
    expect(element.textContent).toContain('account.navigation.quotes.link');
  });

  it('should display link to order templates list', () => {
    fixture.detectChanges();
    expect(element.textContent).toContain('account.ordertemplates.link');
  });

  it('should display link to user list', () => {
    fixture.detectChanges();
    expect(element.textContent).toContain('account.organization.user_management');
  });

  it('should not display link to requisition list if order approval service is disabled', () => {
    fixture.detectChanges();
    expect(element.textContent).not.toContain('account.requisitions.requisitions');
  });

  it('should display link to requisition list if order approval service is enabled', () => {
    component.isOrderApprovalEnabled = true;
    fixture.detectChanges();
    expect(element.textContent).toContain('account.requisitions.requisitions');
  });
});
