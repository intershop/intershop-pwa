import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Constructor
   * @param  {JwtService} privatejwtService
   */
  constructor(private jwtService: JwtService) { }

  /**
   * Intercepts out going request and set authentication-token header provided by jwtService.
   * Intercepts incoming response and update authentication-token header returned from sever in jwtService.
   * @param  {HttpRequest<any>} req
   * @param  {HttpHandler} next
   * @returns  Observable<HttpEvent<any>>
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenHeaderKeyName = 'authentication-token';
    const authorizationHeaderKey = 'Authorization';
    const token = this.jwtService.getToken();

    if (token && !req.headers.has(authorizationHeaderKey)) {
      req = req.clone({ headers: req.headers.set(tokenHeaderKeyName, token) });
    }

    return next.handle(req).do(event => {
      if (event instanceof HttpResponse) {
        const response = <HttpResponse<any>>event;
        const tokenReturned = response.headers.get(tokenHeaderKeyName);
        if (tokenReturned) {
          this.jwtService.saveToken(tokenReturned);
        }
      }
    });
  }
}
