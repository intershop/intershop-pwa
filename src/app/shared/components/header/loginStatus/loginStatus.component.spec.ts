import { LoginStatusComponent } from './loginStatus.component';
import { inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EventEmitter, DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AccountLoginService } from '../../../../pages/accountLogin/accountLoginService';
import { CacheCustomService } from '../../../services/cache/cacheCustom.service';
import { userData } from '../../../../pages/accountLogin/accountLogin.mock';

describe('Login Status Component', () => {
    let fixture: ComponentFixture<LoginStatusComponent>,
        component: LoginStatusComponent,
        element: HTMLElement,
        debugEl: DebugElement;

    class CacheCustomServicestub {
        cacheKeyExists() {
            return true;
        };
        getCachedData() {
            return 'userDetails';
        };
    };

    class RouterStub {
        public navigate(url: string[]) {
            return url;
        }
    };

    class AccountLoginServiceStub {
        public loginStatusEmitter = new Observable((observer) => {
            observer.next({ firstName: 'john', lastName: 'Wick', hasRole: true });

            observer.complete();
        });
        public isAuthorized() {
            return true;
        };

        public logout() { };
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoginStatusComponent
            ],
            providers: [
                { provide: Router, useClass: RouterStub },
                { provide: CacheCustomService, useClass: CacheCustomServicestub },
                { provide: AccountLoginService, useClass: AccountLoginServiceStub }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginStatusComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    });

    it('should check user is logged in', () => {
        component.ngOnInit();

        expect(component.isLoggedIn).toBe(true);
        expect(component.userDetail).not.toBeNull();
    });

    it('should check if register is called with "register"', inject([Router], (router: Router) => {
        const spy = spyOn(router, 'navigate');

        component.register();

        expect(router.navigate).toHaveBeenCalledWith(['register']);
    }));

    it('should check if logout is called with "login"', inject([Router, AccountLoginService], (router: Router, accountLoginService: AccountLoginService) => {
        const spyrouter = spyOn(router, 'navigate');
        const spyaccount = spyOn(accountLoginService, 'logout');

        component.logout();

        expect(router.navigate).toHaveBeenCalledWith(['login']);
        expect(component.userDetail).toBeNull();
        expect(component.isLoggedIn).toBe(false);
        expect(accountLoginService.logout).toHaveBeenCalled();

    }));

    it('should check if signIn method and router.navigate is called', inject([Router], (router: Router) => {
        const spyrouter = spyOn(router, 'navigate');

        component.signIn();

        expect(router.navigate).toHaveBeenCalledWith(['login']);
    }));

    it('should check if user full name, "Logout" and "MyAccount" are rendered on template when user is logged In', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const loggedInDetails = element.getElementsByClassName('hidden-xs');

        expect(loggedInDetails[0].textContent).toEqual('john Wick');
        expect(loggedInDetails[1].textContent).toEqual('My Account');
        expect(loggedInDetails[3].textContent).toEqual('Logout');
    });
});
