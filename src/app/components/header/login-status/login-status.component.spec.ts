import { LoginStatusComponent } from './login-status.component';
import { inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { userData } from '../../../services/account-login/account-login.mock';
import { AccountLoginService } from '../../../services/account-login';
import { GlobalState } from '../../../services';
import { mock, instance, when, anything, verify, capture } from 'ts-mockito';
import { GlobalConfiguration } from '../../../global-configuration/global-configuration';
import { Observable } from 'rxjs/Rx';

describe('Login Status Component', () => {
    let fixture: ComponentFixture<LoginStatusComponent>;
    let component: LoginStatusComponent;
    let element: HTMLElement;
    let routerMock: Router;
    let accountLoginServiceMock: AccountLoginService;
    let globalStateMock: GlobalState;
    let globalConfigurationMock: GlobalConfiguration;

    beforeEach(() => {
        routerMock = mock(Router);
        accountLoginServiceMock = mock(AccountLoginService);

        globalStateMock = mock(GlobalState);
        const callBackMock = (key, callBack: Function) => callBack(userData);
        when(globalStateMock.subscribe(anything(), anything())).thenCall(callBackMock);
        when(globalStateMock.subscribeCachedData(anything(), anything())).thenCall(callBackMock);

        globalConfigurationMock = mock(GlobalConfiguration);
        when(globalConfigurationMock.getApplicationSettings()).thenReturn(Observable.of(false));

        TestBed.configureTestingModule({
            declarations: [
                LoginStatusComponent
            ],
            providers: [
                { provide: Router, useFactory: () => instance(routerMock) },
                { provide: AccountLoginService, useFactory: () => instance(accountLoginServiceMock) },
                { provide: GlobalState, useFactory: () => instance(globalStateMock) },
                { provide: GlobalConfiguration, useFactory: () => instance(globalConfigurationMock) },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginStatusComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
        expect(element).toBeTruthy();
    });

    it('should log in mocked user', () => {
        expect(component.isLoggedIn).toBe(true);
        expect(component.userDetail).toBeTruthy();
    });

    it('should navigate to "register" when register is clicked', () => {
        component.register();
        verify(routerMock.navigate(anything())).once();
        const [navigateToArgument] = capture(routerMock.navigate).last();
        expect(navigateToArgument).toEqual(['register']);
    });

    it('should navigate to "home" and unset userDetails when logout is called', () => {
        // mocked user details in place
        expect(component.userDetail).toBeTruthy();

        component.logout();

        verify(accountLoginServiceMock.logout()).once();

        verify(routerMock.navigate(anything())).once();
        const [navigateToArgument] = capture(routerMock.navigate).last();
        expect(navigateToArgument).toEqual(['home']);

        expect(component.userDetail).toBeNull();
        expect(component.isLoggedIn).toBe(false);
    });

    it('should navigate to "login" when signIn is called', inject([Router], (router: Router) => {
        component.signIn();

        verify(routerMock.navigate(anything())).once();
        const [navigateToArgument] = capture(routerMock.navigate).last();
        expect(navigateToArgument).toEqual(['login']);
    }));

    it('should render full name on template when user is logged in', () => {
        const loggedInDetails = element.getElementsByClassName('login-name');
        expect(loggedInDetails[0].textContent).toEqual('Patricia Miller');
    });

    xit('should verify that isLoggedIn is set to false when globalState returns null', () => {
        fixture.detectChanges();
        when(globalStateMock.subscribe(anything(), anything())).thenReturn(null);
        when(globalStateMock.subscribeCachedData(anything(), anything())).thenReturn(null);
        expect(component.isLoggedIn).toBe(false);
    });

    it('should call accountOverview and verify if router.navigate is called with "accountOverview"', () => {
        component.accountOverview();
        verify(routerMock.navigate(anything())).once();
        const [navigateToArgument] = capture(routerMock.navigate).last();
        expect(navigateToArgument).toEqual(['accountOverview']);
    });
});
