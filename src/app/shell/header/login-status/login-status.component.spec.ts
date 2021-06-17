import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { User } from 'ish-core/models/user/user.model';

import { LazyHierarchySwitchComponent } from '../../../extensions/organization-hierarchies/exports/lazy-hierarchy-switch/lazy-hierarchy-switch.component';

import { LoginStatusComponent } from './login-status.component';

describe('Login Status Component', () => {
  let component: LoginStatusComponent;
  let fixture: ComponentFixture<LoginStatusComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;
  let appFacade: AppFacade;

  const userData = {
    firstName: 'Patricia',
    lastName: 'Miller',
  } as User;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    appFacade = mock(AppFacade);
    await TestBed.configureTestingModule({
      declarations: [
        LoginStatusComponent,
        MockComponent(FaIconComponent),
        MockComponent(LazyHierarchySwitchComponent),
        MockDirective(FeatureToggleDirective),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginStatusComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render logout link if user is logged in', () => {
    when(accountFacade.user$).thenReturn(of(userData));
    fixture.detectChanges();

    expect(element.querySelector('a[data-testing-id=link-logout]')).toBeTruthy();
  });

  it('should not render logout link if user is not logged in', () => {
    fixture.detectChanges();

    expect(element.querySelector('a[data-testing-id=link-logout]')).toBeFalsy();
  });

  it('should render full name on template when user is logged in', () => {
    when(accountFacade.user$).thenReturn(of(userData));
    fixture.detectChanges();

    const loggedInDetails = element.getElementsByClassName('login-name');
    expect(loggedInDetails).toBeTruthy();
    expect(loggedInDetails.length).toBeGreaterThan(0);
    expect(loggedInDetails[0].textContent).toEqual('Patricia Miller');
  });

  it('should render nothing on template when user is not logged in', () => {
    fixture.detectChanges();

    const loggedInDetails = element.getElementsByClassName('login-name');
    expect(loggedInDetails).toHaveLength(0);
  });
});
