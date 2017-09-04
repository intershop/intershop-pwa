import { LoginStatusComponent } from './login-status.component';
import { inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { userData } from '../../../services/account-login/account-login.mock';
import { AccountLoginService } from '../../../services/account-login';
import { GlobalState } from '../../../services';


describe('Login Status Component', () => {
    let fixture: ComponentFixture<LoginStatusComponent>;
    let component: LoginStatusComponent;
    let element: HTMLElement;
    let debugEl: DebugElement;

    class RouterStub {
        public navigate(url: string[]) {
            return url;
        }
    }

    class AccountLoginServiceStub {
        logout() { }
    }

    class GlobalStateStub {
        subscribeCachedData(key, callBack: Function) {
            callBack(userData);
        }
        subscribe(key, callBack: Function) {
            callBack(userData);
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                LoginStatusComponent
            ],
            providers: [
                { provide: Router, useClass: RouterStub },
                { provide: AccountLoginService, useClass: AccountLoginServiceStub },
                { provide: GlobalState, useClass: GlobalStateStub },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginStatusComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    });

    it('should create the component', () => {
        const app = debugEl.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should check if user is logged in', () => {
        component.ngOnInit();
        expect(component.isLoggedIn).toBe(true);
        expect(component.userDetail).not.toBeNull();
    });

    it('should call register method and verify if router.navigate is called with "register"', inject([Router], (router: Router) => {
        const spy = spyOn(router, 'navigate');
        component.register();
        expect(spy).toHaveBeenCalledWith(['register']);
    }));

    it('should call logout method and verify if router.navigate is called with "home" and userDetails are null', inject([Router, AccountLoginService], (router: Router, accountLoginService: AccountLoginService) => {
        const spyrouter = spyOn(router, 'navigate');
        const spyaccount = spyOn(accountLoginService, 'logout');
        component.logout();
        expect(spyrouter).toHaveBeenCalledWith(['home']);
        expect(component.userDetail).toBeNull();
        expect(component.isLoggedIn).toBe(false);
        expect(spyaccount).toHaveBeenCalled();
    }));

    it('should call signIn method and verify if router.navigate is called with "login"', inject([Router], (router: Router) => {
        const spyrouter = spyOn(router, 'navigate');
        component.signIn();
        expect(spyrouter).toHaveBeenCalledWith(['login']);
    }));

    it('should check if user full name is getting rendered on template when user is logged In', () => {
        component.ngOnInit();
        fixture.detectChanges();
        const loggedInDetails = element.getElementsByClassName('login-name');
        expect(loggedInDetails[0].textContent).toEqual('Patricia Miller');
    });
});
