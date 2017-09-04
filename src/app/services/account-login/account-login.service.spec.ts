import { TestBed } from '@angular/core/testing';
import { InstanceService } from 'app/services/instance.service';
import { AccountLoginService } from './account-login.service';
import { AccountLoginMockService } from './account-login.service.mock';
import { async } from '@angular/core/testing';
import { inject } from '@angular/core/testing';
import { JwtService } from 'app/services/jwt.service';

import { CacheCustomService, GlobalState } from 'app/services';
import { environment } from 'environments/environment';


describe('AccountLogin Service', () => {
    let tokenExists = true;
    environment.needMock = true;
    class JwtServiceStub {
        saveToken(token) {
            return token;
        }
        destroyToken(token) {
            return token;
        }
        getToken() {
            return tokenExists;
        }
    }

    class CacheCustomServiceStub {
        cacheKeyExists(key) {
            return true;
        }
        getCachedData(key, isDecrypyted) {
            return true;
        }
        storeDataToCache(data, key, shouldEncrypt) {
            return true;
        }
        deleteCacheKey() {
            return true;
        }
    }

    class GlobalStateServiceStub {
        notifyDataChanged(event, value) {
            return true;
        }
        subscribe(event: string, callback: Function) {
            callback();
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AccountLoginService, AccountLoginMockService, InstanceService,
                { provide: JwtService, useClass: JwtServiceStub },
                { provide: CacheCustomService, useClass: CacheCustomServiceStub },
                { provide: GlobalState, useClass: GlobalStateServiceStub }
            ]
        });
    });

    it('should login user', async(inject([AccountLoginService], (accountLoginService: AccountLoginService) => {
        const userDetails = { userName: 'intershop@123.com', password: '123456' };
        accountLoginService.singinUser(userDetails).subscribe((data) => {
            expect(data).not.toBe(null);
        });
    })));

    it('should logout user', async(inject([AccountLoginService, JwtService], (accountLoginService: AccountLoginService, jwtService: JwtService) => {
        spyOn(jwtService, 'destroyToken');
        accountLoginService.logout();
        expect(jwtService.destroyToken).toHaveBeenCalled();
    })));

    it(`shouldn't login user as the credentials passed are incorrect`, async(inject([AccountLoginService], (accountLoginService: AccountLoginService) => {
        const userDetails = { userName: 'intershop@123.com', password: 'wrong' };
        accountLoginService.singinUser(userDetails).subscribe((data) => {
            expect(data).toBe(null);
        });
    })));

    it('should call isAuthorized method when token exists in the memory', async(inject([AccountLoginService], (accountLoginService: AccountLoginService) => {
        const result = accountLoginService.isAuthorized();
        expect(result).toBe(true);
    })));

    it('should call isAuthorized method when no token exixts in memory', async(inject([AccountLoginService], (accountLoginService: AccountLoginService) => {
        tokenExists = false;
        const result = accountLoginService.isAuthorized();
        expect(result).toBe(false);
    })));
});
