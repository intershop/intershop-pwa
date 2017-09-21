import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AccountLogin } from './account-login';
import { UserDetail } from './account-login.model';
import { userData } from './account-login.mock';
import * as _ from 'lodash';

@Injectable()
export class AccountLoginMockService {
    loginStatusEmitter = new EventEmitter();
    authorizedUser: AccountLogin =
    {
        userName: 'intershop@123.com',
        password: '123456'
    };

    /**
     * For logging in
     * @param  {AccountLogin} user
     * @returns Observable
     */
    singinUser(user: AccountLogin): Observable<UserDetail | any> {
        if (_.isEqual(user, this.authorizedUser)) {
            return this.getUserDetail();
        } else { return Observable.of({ errorCode: 'Err001', parameter: [1], fieldName: 'password' }); }
    }

    /**
     * Provides detail of logged in user
     * @returns Observable
     */
    private getUserDetail(): Observable<UserDetail> {
        return Observable.of(userData);
    }
}


