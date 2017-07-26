import { ComponentFixture } from '@angular/core/testing';
import { DebugElement, Injector } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router/router';
import { Observable } from 'rxjs/Rx';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountLoginMockService, AccountLoginService } from './accountLoginService';
import { InstanceService } from '../../shared/services/instance.service';
import { CacheCustomService } from '../../shared/services/cache/cacheCustom.service';
import { CacheService } from 'ng2-cache/ng2-cache';
import { EncryptDecryptService } from '../../shared/services/cache/encryptDecrypt.service';
import { CompressDecompressService } from '../../shared/services/cache/compressDecompress.service';
import { JwtService } from '../../shared/services/jwt.service';
import { AccountLoginComponent } from './accountLogin.component';


describe('Login Component', () => {
    let fixture: ComponentFixture<AccountLoginComponent>,
        component: AccountLoginComponent,
        element: HTMLElement,
        debugEl: DebugElement;
        const mockFormBuilder = null; let mockAccountLoginService, router; const mockActivatedRoute = null;
        let accountLoginComponent: AccountLoginComponent; const accountLoginMockService = null

    beforeEach(() => {
        router = {
            navigate: jasmine.createSpy('navigate')
        }

        mockAccountLoginService = {
            singinUser: (userData) => {
                if (userData.userName === 'intershop@123.com' && userData.password === '123456') {
                    return Observable.of(true);
                } else {
                    return Observable.of(false);
                }
            }
        }

        TestBed.configureTestingModule({
            declarations: [
                AccountLoginComponent
            ],
            providers: [
                AccountLoginService, InstanceService, AccountLoginMockService,
                JwtService, CacheCustomService, CacheService, EncryptDecryptService, CompressDecompressService
            ],
            imports: [
                RouterTestingModule, ReactiveFormsModule
            ]
        });
    })

    beforeEach(() => {
        accountLoginComponent = new AccountLoginComponent(mockFormBuilder, mockAccountLoginService, router, mockActivatedRoute);
        fixture = TestBed.createComponent(AccountLoginComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    })

    it('should check if controls are rendered on Login page', () => {
        expect(element.querySelector('#ShopLoginForm_Login')).toBeDefined();
        expect(element.querySelector('#ShopLoginForm_Password')).toBeDefined();
        expect(element.getElementsByClassName('btn btn-primary')).toBeDefined();
    });

    it(`should checks if router.navigate is called with 'register'`, () => {
        accountLoginComponent.registerUser();
        expect(router.navigate).toHaveBeenCalledWith(['register']);
    });

    it(`should log in the user and checks if router.navigate is called with 'familyPage'`, () => {
        const userDetails = { userName: 'intershop@123.com', password: '123456' };
        accountLoginComponent.onSignin(userDetails);
        expect(router.navigate).toHaveBeenCalledWith(['familyPage']);
    });

    it(`should not call router.navigate since credentials are wrong`, () => {
        const userDetails = { userName: 'intershop@123.com', password: '12' }
        accountLoginComponent.onSignin(userDetails);
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should call ngOnInit method', () => {
        component.ngOnInit();
        expect(component.loginForm).toBeDefined();
    })
});
