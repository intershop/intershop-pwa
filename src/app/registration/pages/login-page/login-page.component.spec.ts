import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomFormsModule } from 'ng2-validation';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, when } from 'ts-mockito';
import { USE_SIMPLE_ACCOUNT, USER_REGISTRATION_LOGIN_TYPE } from '../../../core/configurations/injection-keys';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { SharedModule } from '../../../shared/shared.module';
import { LoginPageComponent } from './login-page.component';

describe('AccountLogin Component', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let component: LoginPageComponent;
  let element: HTMLElement;
  let debugEl: DebugElement;

  beforeEach(async(() => {
    const accountLoginServiceMock = mock(AccountLoginService);
    when(accountLoginServiceMock.singinUser(anything())).thenCall((userDetails) => {
      if (userDetails.userName === 'intershop@123.com' && userDetails.password === '123456') {
        return of({ data: 'Correct Details' });
      } else {
        return of('Incorrect Credentials');
      }
    });

    TestBed.configureTestingModule({
      declarations: [
        LoginPageComponent
      ],
      providers: [
        { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
        { provide: USE_SIMPLE_ACCOUNT, useValue: true },
        { provide: USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' }
      ],
      imports: [
        SharedModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'home', component: LoginPageComponent }
        ]),
        CustomFormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should check if controls are rendered on Login page', () => {
    expect(element.querySelector('input[data-testing-id=userName]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=password]')).toBeTruthy();
    expect(element.getElementsByClassName('btn btn-primary')).toBeTruthy();
  });

  it('should set isDirty to true when form is invalid', () => {
    const userDetails = { userName: 'intershop@123.com', password: '12346' };
    component.onSignin(userDetails);
  });

  it('should set errorUser when user enters wrong credentials', () => {
    const userDetails = { userName: 'intershop@123.com', password: 'wrong' };
    component.loginForm.controls['userName'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('!InterShop0');
    component.onSignin(userDetails);
    expect(component.errorUser).toEqual('Incorrect Credentials');
  });

  it('should navigate to homepage when user enters valid credentials', async(() => {
    const userDetails = { userName: 'intershop@123.com', password: '123456' };
    component.loginForm.controls['userName'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('!InterShop0');
    component.onSignin(userDetails);

  }));

  it('should assign value to Email field to test Email validator', () => {
    component.loginForm.controls['userName'].setValue('test@test.com');
    expect(component.loginForm.controls['userName'].value).toEqual('test@test.com');
  });
});
