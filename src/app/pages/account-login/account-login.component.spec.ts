import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomFormsModule } from 'ng2-validation';
import { Observable } from 'rxjs/Rx';
import { anything, instance, mock, when } from 'ts-mockito';
import { GlobalConfiguration } from '../../configurations/global.configuration';
import { SharedModule } from '../../modules/shared.module';
import { AccountLoginService } from '../../services/account-login/account-login.service';
import { AccountLoginComponent } from './account-login.component';

describe('AccountLogin Component', () => {
  let fixture: ComponentFixture<AccountLoginComponent>;
  let component: AccountLoginComponent;
  let element: HTMLElement;
  let debugEl: DebugElement;

  beforeEach(async(() => {
    const accountLoginServiceMock = mock(AccountLoginService);
    when(accountLoginServiceMock.singinUser(anything())).thenCall((userDetails) => {
      if (userDetails.userName === 'intershop@123.com' && userDetails.password === '123456') {
        return Observable.of({ data: 'Correct Details' });
      } else {
        return Observable.of('Incorrect Credentials');
      }
    });

    const globalConfigurationMock = mock(GlobalConfiguration);
    when(globalConfigurationMock.getApplicationSettings()).thenReturn(Observable.of({
      useSimpleAccount: true,
      userRegistrationLoginType: 'email'
    }));

    TestBed.configureTestingModule({
      declarations: [
        AccountLoginComponent
      ],
      providers: [
        { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
        { provide: GlobalConfiguration, useFactory: () => instance(globalConfigurationMock) }
      ],
      imports: [
        SharedModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'home', component: AccountLoginComponent }
        ]),
        CustomFormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLoginComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should check if controls are rendered on Login page', () => {
    expect(element.querySelector('#ShopLoginForm_Login')).toBeTruthy();
    expect(element.querySelector('#ShopLoginForm_Password')).toBeTruthy();
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
