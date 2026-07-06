import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, provideRouter } from '@angular/router';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { LoginFormComponent } from './login-form.component';

describe('Login Form Component', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;
  let appFacade: AppFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);
    appFacade = mock(AppFacade);
    when(appFacade.serverSetting$(anyString())).thenReturn(of('email'));

    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent, MockComponent(ErrorMessageComponent)],
      imports: [FormlyTestingModule, RouterModule, TranslatePipe],
      providers: [
        {
          provide: AccountFacade,
          useFactory: () => instance(accountFacade),
        },
        {
          provide: AppFacade,
          useFactory: () => instance(appFacade),
        },
        provideRouter([]),
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render login form on Login page', () => {
    fixture.detectChanges();
    expect(component.form.get('login')).toBeTruthy();
    expect(component.form.get('password')).toBeTruthy();
  });
});
