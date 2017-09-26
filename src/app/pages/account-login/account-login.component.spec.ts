import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CacheService } from 'ng2-cache/ng2-cache';
import { CustomFormsModule } from 'ng2-validation';
import { Observable } from 'rxjs/Rx';
import { anyString, instance, mock, when } from 'ts-mockito';
import { GlobalConfiguration } from '../../configurations/global.configuration';
import { SharedModule } from '../../modules/shared.module';
import { AccountLoginService } from '../../services/account-login/';
import { CacheCustomService } from '../../services/cache/cache-custom.service';
import { EncryptDecryptService } from '../../services/cache/encrypt-decrypt.service';
import { LocalizeRouterService } from '../../services/routes-parser-locale-currency/localize-router.service';
import { AccountLoginComponent } from './account-login.component';

describe('AccountLogin Component', () => {
  let fixture: ComponentFixture<AccountLoginComponent>;
  let component: AccountLoginComponent;
  let element: HTMLElement;
  let debugEl: DebugElement;
  let localizeRouterServiceMock: LocalizeRouterService;

  class MockAccountLoginService {
    singinUser(userDetails) {
      if (userDetails.userName === 'intershop@123.com' && userDetails.password === '123456') {
        return Observable.of({ data: 'Correct Details' });
      } else {
        return Observable.of('Incorrect Credentials');
      }
    }
  }

  class GlobalConfigurationStub {
    getApplicationSettings() {
      const accountSettings = {
        useSimpleAccount: true,
        userRegistrationLoginType: 'email'
      };
      return Observable.of(accountSettings);
    }
  }

  beforeEach(async(() => {
    localizeRouterServiceMock = mock(LocalizeRouterService);
    when(localizeRouterServiceMock.translateRoute(anyString())).thenCall((arg1: string) => {
      return arg1;
    });

    TestBed.configureTestingModule({
      declarations: [
        AccountLoginComponent
      ],
      providers: [
        CacheCustomService, CacheService, EncryptDecryptService,
        { provide: AccountLoginService, useClass: MockAccountLoginService },
        { provide: GlobalConfiguration, useClass: GlobalConfigurationStub },
        { provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) }

      ],
      imports: [
        SharedModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
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
    const router = TestBed.get(Router);
    this.navSpy = spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should check if controls are rendered on Login page', () => {
    expect(element.querySelector('#ShopLoginForm_Login')).toBeTruthy();
    expect(element.querySelector('#ShopLoginForm_Password')).toBeTruthy();
    expect(element.getElementsByClassName('btn btn-primary')).toBeTruthy();
  });

  it(`should call onSignIn when loginForm is invalid`, () => {
    const userDetails = { userName: 'intershop@123.com', password: '12346' };
    component.onSignin(userDetails);
    expect(this.navSpy).not.toHaveBeenCalled();
  });

  it(`should call onSignIn when loginForm is valid but credentials are incorrect`, () => {
    const userDetails = { userName: 'intershop@123.com', password: 'wrong' };
    component.loginForm.controls['userName'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('!InterShop0');
    component.onSignin(userDetails);
    expect(component.errorUser).toEqual('Incorrect Credentials');
  });

  it(`should call onSignIn when loginForm is valid with correct credentials`, () => {
    const userDetails = { userName: 'intershop@123.com', password: '123456' };
    component.loginForm.controls['userName'].setValue('test@test.com');
    component.loginForm.controls['password'].setValue('!InterShop0');
    component.onSignin(userDetails);
    expect(this.navSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should call ngOnInit method', () => {
    expect(component.loginForm).toBeTruthy();
  });

  it('should assign value to Email field to test Email validator', () => {
    component.loginForm.controls['userName'].setValue('test@test.com');
    expect(component.loginForm.controls['userName'].value).toEqual('test@test.com');
  });
});
