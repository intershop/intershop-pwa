import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { USER_REGISTRATION_LOGIN_TYPE } from 'ish-core/configurations/injection-keys';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoginFormComponent } from 'ish-shared/forms/components/login-form/login-form.component';

import { LoginFormContainerComponent } from './login-form.container';

describe('Login Form Container', () => {
  let component: LoginFormContainerComponent;
  let fixture: ComponentFixture<LoginFormContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginFormContainerComponent, MockComponent(LoginFormComponent)],
      imports: [TranslateModule.forRoot(), ngrxTesting({ reducers: coreReducers })],
      providers: [{ provide: USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render login form after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-login-form')).toBeTruthy();
  });
});
