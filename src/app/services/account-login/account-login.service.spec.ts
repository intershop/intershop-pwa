import { mock, instance, when, anything, verify } from 'ts-mockito';
import { TestBed, async } from '@angular/core/testing';
import { AccountLoginService } from './index';
import { JwtService, GlobalState, CacheCustomService, ApiService } from '../index';
import { Observable } from 'rxjs/Rx';

describe('AccountLogin Service', () => {
    let accountLoginService: AccountLoginService;
    let jwtServiceMock = mock(JwtService);
    let globalStateMock = mock(GlobalState);
    let cacheCustomServiceMock = mock(CacheCustomService);
    let apiServiceMock = mock(ApiService);

    beforeEach(() => {
        accountLoginService = new AccountLoginService(instance(jwtServiceMock), instance(globalStateMock), instance(cacheCustomServiceMock), instance(apiServiceMock));
    });

    it('should login user' , () => {
        const loginDetail = { userName: 'patricia@test.intershop.de', password: '!InterShop00!' };
        when(apiServiceMock.get(anything(), anything(), anything())).thenReturn(Observable.of({authorized: true}));
        let loggedInDetail;
        accountLoginService.singinUser(loginDetail).subscribe( data => {
            loggedInDetail = data;
        })
        verify(globalStateMock.notifyDataChanged(anything(), anything())).called();
        expect(loggedInDetail).not.toBe({authorized: true});
    });

    it('should confirm destroyToken method of jwt service is called', () => {
        accountLoginService.logout();
        verify(jwtServiceMock.destroyToken()).called();
    });

    it('should confirm isAuthorized method of jwt service is called when isAuthorized method is called', () => {
        when(jwtServiceMock.getToken()).thenReturn('Authorised');
        const authorized = accountLoginService.isAuthorized();
        expect(authorized).toBe(true);
    });
});