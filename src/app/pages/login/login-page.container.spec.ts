import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { LoginFormContainerComponent } from 'ish-shared/forms/containers/login-form/login-form.container';

import { LoginPageContainerComponent } from './login-page.container';

describe('Login Page Container', () => {
  let fixture: ComponentFixture<LoginPageContainerComponent>;
  let component: LoginPageContainerComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [LoginPageContainerComponent, MockComponent(LoginFormContainerComponent)],
      providers: [{ provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render login form container on Login page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-login-form-container')).toBeTruthy();
  });
});
