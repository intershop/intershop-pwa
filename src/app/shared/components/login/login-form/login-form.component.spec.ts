/* eslint-disable ish-custom-rules/no-intelligence-in-artifacts */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { LoginFormComponent } from './login-form.component';

describe('Login Form Component', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let element: HTMLElement;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, LoginFormComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: AccountFacade,
          useFactory: () => instance(accountFacade),
        },
        provideMockStore(),
        provideRouter([]),
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
