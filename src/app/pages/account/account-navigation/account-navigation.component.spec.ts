import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { RoleToggleModule } from 'ish-core/role-toggle.module';

import { AccountUserInfoComponent } from '../account-user-info/account-user-info.component';

import { AccountNavigationComponent } from './account-navigation.component';

describe('Account Navigation Component', () => {
  let component: AccountNavigationComponent;
  let fixture: ComponentFixture<AccountNavigationComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AccountNavigationComponent,
        MockComponent(AccountUserInfoComponent),
        MockPipe(FeatureTogglePipe, () => true),
        MockPipe(ServerSettingPipe, () => true),
      ],
      imports: [
        AuthorizationToggleModule.forTesting('APP_B2B_MANAGE_USERS', 'APP_B2B_PURCHASE'),
        RoleToggleModule.forTesting(),
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

  it('should display link to requisition list if order approval service is enabled', () => {
    fixture.detectChanges();
    expect(element.textContent).toContain('account.requisitions.requisitions');
  });
});
