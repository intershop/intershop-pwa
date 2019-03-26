import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { USER_REGISTRATION_LOGIN_TYPE } from 'ish-core/configurations/injection-keys';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { LoginFormContainerComponent } from './login-form.container';

describe('Login Form Container', () => {
  let component: LoginFormContainerComponent;
  let fixture: ComponentFixture<LoginFormContainerComponent>;
  let element: HTMLElement;
  let storeMock$: Store<{}>;

  beforeEach(async(() => {
    storeMock$ = mock(Store);

    TestBed.configureTestingModule({
      declarations: [
        LoginFormContainerComponent,
        MockComponent({
          selector: 'ish-login-form',
          template: 'Login Form',
          inputs: ['loginType', 'error', 'login'],
        }),
      ],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' },
        { provide: Store, useFactory: () => instance(storeMock$) },
      ],
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
