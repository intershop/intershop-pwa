import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { mock, when } from 'ts-mockito';

import { AuthorizationToggleModule } from 'ish-core/authorization-toggle.module';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';

import { AccountUserInfoComponent } from '../account-user-info/account-user-info.component';

import { AccountNavigationComponent } from './account-navigation.component';

describe('Account Navigation Component', () => {
  let component: AccountNavigationComponent;
  let fixture: ComponentFixture<AccountNavigationComponent>;
  let element: HTMLElement;
  let accountFacadeMock: AccountFacade;

  beforeEach(async () => {
    accountFacadeMock = mock(AccountFacade);
    await TestBed.configureTestingModule({
      declarations: [AccountNavigationComponent, MockComponent(AccountUserInfoComponent), MockPipe(FeatureTogglePipe)],
      imports: [
        AuthorizationToggleModule.forTesting('APP_B2B_MANAGE_USERS'),
        FeatureToggleModule.forTesting('quoting', 'orderTemplates'),
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    when(accountFacadeMock.isBusinessCustomer$).thenReturn(of(true));
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
});
