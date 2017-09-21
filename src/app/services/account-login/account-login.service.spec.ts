
import { Observable } from 'rxjs/Rx';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { ApiService, CacheCustomService, GlobalState, JwtService } from '../index';
import { AccountLoginService } from './index';

describe('AccountLogin Service', () => {
    let accountLoginService: AccountLoginService;
    const jwtServiceMock = mock(JwtService);
    const globalStateMock = mock(GlobalState);
    const cacheCustomServiceMock = mock(CacheCustomService);
    const apiServiceMock = mock(ApiService);

    beforeEach(() => {
        accountLoginService = new AccountLoginService(instance(jwtServiceMock), instance(globalStateMock), instance(cacheCustomServiceMock), instance(apiServiceMock));
    });

    it('should login user', () => {
        const loginDetail = { userName: 'patricia@test.intershop.de', password: '!InterShop00!' };
        when(apiServiceMock.get(anything(), anything(), anything())).thenReturn(Observable.of({ authorized: true }));
        let loggedInDetail;
        accountLoginService.singinUser(loginDetail).subscribe(data => {
            loggedInDetail = data;
        });

        verify(globalStateMock.notifyDataChanged(anything(), anything())).called();
        expect(loggedInDetail).not.toBe({ authorized: true });
    });

    it('should confirm destroyToken method of jwt service is called', () => {
        accountLoginService.logout();
        verify(jwtServiceMock.destroyToken()).called();
    });

    it(`shouldn't login user as the credentials passed are incorrect`, () => {
        const userDetails = { userName: 'intershop@123.com', password: 'wrong' };
        when(apiServiceMock.get(anything(), anything(), anything())).thenReturn(Observable.of('401 and Unauthorized'));
        accountLoginService.singinUser(userDetails).subscribe((data) => {
            expect(data).toBe('401 and Unauthorized');
        });
    });

    it('should call isAuthorized method and and return false when token does not exist', () => {
        when(jwtServiceMock.getToken()).thenReturn('');
        const result = accountLoginService.isAuthorized();
        expect(result).toBe(false);
    });

    it('should confirm isAuthorized method of jwt service is called when isAuthorized method is called', () => {
        when(jwtServiceMock.getToken()).thenReturn('Authorised');
        const authorized = accountLoginService.isAuthorized();
        expect(authorized).toBe(true);
    });
});
