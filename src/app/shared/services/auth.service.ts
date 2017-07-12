import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { ApiService } from './api.service';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { environment } from 'environments/environment';
import { JwtService } from './jwt.service';
import {AccountLogin} from '../../pages/accountLogin/accountLogin'



export const UNKNOWN_USER: AccountLogin = {
    userName: 'Unknown'
};

@Injectable()
export class AuthService {
    private subject = new BehaviorSubject(UNKNOWN_USER);
    user$: Observable<AccountLogin> = this.subject.asObservable();

    constructor(
        private apiService: ApiService,
        private jwtService: JwtService,
        private http: Http
    ) { }



    singinUser(user: AccountLogin, username: any): Observable<any> {
        // tslint:disable-next-line:quotemark
        return this.http.post(`${environment.api_url}token`, 'grant_type=password&username=' + user.userName + "&password=" + user.password)
            .map((res: Response) => {
                const response = res.json();
                if (response.access_token) {
                    this.jwtService.saveToken(response.access_token);
                }
                return response;
            }).do(() => {
                this.subject.next(username);
            });
    };

    isAuthenticated(): Observable<boolean> {
        if (this.jwtService.getToken().length > 0) {
            return Observable.of(true);

        }
    };

    logout() {
        this.jwtService.destroyToken();
    }

}
