import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { USER_REGISTRATION_LOGIN_TYPE } from '../../../core/configurations/injection-keys';
import { CoreState } from '../../../core/store/core.state';
import { MockComponent } from '../../../utils/dev/mock.component';
import { LoginPageContainerComponent } from './login-page.container';

describe('Login Page Container', () => {
  let fixture: ComponentFixture<LoginPageContainerComponent>;
  let component: LoginPageContainerComponent;
  let element: HTMLElement;
  let storeMock$: Store<CoreState>;

  beforeEach(async(() => {
    storeMock$ = mock(Store);

    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-login-form',
          template: 'Login Form',
          inputs: ['loginType', 'isLoggedIn', 'error'],
        }),
        LoginPageContainerComponent,
      ],
      providers: [
        { provide: USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' },
        { provide: Store, useFactory: () => instance(storeMock$) },
      ],
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

  it('should render login form on Login page', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-login-form')).toBeTruthy();
  });
});
