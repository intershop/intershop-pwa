import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AccountLoginMockService, AccountLoginService } from './accountLoginService';
import { InstanceService } from '../../shared/services/instance.service';
import { CacheCustomService } from '../../shared/services/cache/cacheCustom.service';
import { CacheService } from 'ng2-cache/ng2-cache';
import { EncryptDecryptService } from '../../shared/services/cache/encryptDecrypt.service';
import { JwtService } from '../../shared/services/jwt.service';
import { AccountLoginComponent } from './accountLogin.component';
import { inject, async } from '@angular/core/testing';


describe('AccountLogin Component', () => {
    let fixture: ComponentFixture<AccountLoginComponent>,
        component: AccountLoginComponent,
        element: HTMLElement,
        debugEl: DebugElement;

    class MockAccountLoginService {
        singinUser(userData) {
            if (userData.userName === 'intershop@123.com' && userData.password === '123456') {
                return Observable.of(true);
            } else {
                return Observable.of(false);
            }
        }
    }

    class RouterStub {
        public navigate(url: string[]) {
            return url;
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AccountLoginComponent
            ],
            providers: [
                InstanceService, AccountLoginMockService,
                JwtService, CacheCustomService, CacheService, EncryptDecryptService,
                { provide: AccountLoginService, useClass: MockAccountLoginService },
                { provide: Router, useClass: RouterStub }
            ],
            imports: [
                ReactiveFormsModule
            ]
        })
            .compileComponents();
    }))

    beforeEach(() => {
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

    it(`should checks if router.navigate is called with 'register'`, inject([Router], (router: Router) => {
        const spy = spyOn(router, 'navigate');
        component.registerUser();
        expect(router.navigate).toHaveBeenCalledWith(['register']);
    })
    );

    it(`should log in the user and checks if router.navigate is called with 'familyPage'`, inject([Router], (router: Router) => {
        const userDetails = { userName: 'intershop@123.com', password: '123456' };
        const spy = spyOn(router, 'navigate');
        component.onSignin(userDetails);
        expect(router.navigate).toHaveBeenCalledWith(['familyPage']);
    })
    );


    it(`should not call router.navigate since credentials are wrong`, inject([Router], (router: Router) => {
        const userDetails = { userName: 'intershop@123.com', password: '12' };
        const spy = spyOn(router, 'navigate');
        component.onSignin(userDetails);
        expect(router.navigate).not.toHaveBeenCalled();
    })
    )

    it('should call ngOnInit method', () => {
        component.ngOnInit();
        expect(component.loginForm).toBeDefined();
    })

    it('should assign value to Email field to test Email validator', () => {
        component.ngOnInit();
        component.loginForm.controls['userName'].setValue('test@test.com');
        expect(component.loginForm.controls['userName'].value).toEqual('test@test.com');
    })
});
