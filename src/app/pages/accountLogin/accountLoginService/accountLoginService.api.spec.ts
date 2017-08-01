import { Observable } from 'rxjs/Rx';
import { TestBed, inject } from '@angular/core/testing';
import { AccountLoginApiService } from './accountLogin.service.api';
import { ResponseOptions } from '@angular/http';
import { JwtService } from '../../../shared/services/jwt.service';
import { ApiService } from '../../../shared/services/api.service';


describe('AccountLoginApi Service', () => {
    let tokenExists = true;
    class ApiServiceStub {
        post(userName, password) {
            const data = {
                'access_token': 'User Authorized'
            }
            return Observable.of(JSON.stringify(data));
        }
    }

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

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AccountLoginApiService,
                { provide: ApiService, useClass: ApiServiceStub },
                { provide: JwtService, useClass: JwtServiceStub }
            ],
            imports: [
            ]
        });
    })

    it('should login user', inject([AccountLoginApiService], (accountLoginApiService: AccountLoginApiService) => {
        const userDetails = { userName: 'intershop@123.com', password: '123456' };
        accountLoginApiService.singinUser(userDetails).subscribe((data) => {
            expect(data).not.toBeNull();
        })
    }))


    it('should logout user', inject([AccountLoginApiService, JwtService], (accountLoginApiService: AccountLoginApiService, jwtService: JwtService) => {
        const spy = spyOn(jwtService, 'destroyToken');
        accountLoginApiService.logout();
        expect(jwtService.destroyToken).toHaveBeenCalled();
    })
    )

    it('should call isAuthorized method whrn token exists in memory', inject([AccountLoginApiService, JwtService], (accountLoginApiService: AccountLoginApiService, jwtService: JwtService) => {
        const result = accountLoginApiService.isAuthorized();
        expect(result).toBe(true);
    })
    )

     it('should call isAuthorized method whrn token exists in memory', inject([AccountLoginApiService, JwtService], (accountLoginApiService: AccountLoginApiService, jwtService: JwtService) => {
        tokenExists = false;
        const result = accountLoginApiService.isAuthorized();
        expect(result).toBe(false);
    })
    )
});
