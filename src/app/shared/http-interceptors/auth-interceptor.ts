import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpEventType, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
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
    // TODO Maybe we should also be neutral on requests
    // that are not meant for our service backend?
    // E.g. req.url not same base URL like environment.base_url
    const tokenHeaderKeyName = 'authentication-token';
    const authorizationHeaderKey = 'Authorization';
    const token = this.jwtService.getToken();

    if (token && !req.headers.has(authorizationHeaderKey)) {
      req = req.clone({ headers: req.headers.set(tokenHeaderKeyName, token) });
    }

    return next.handle(req).do(event => {
      if (event.type === HttpEventType.ResponseHeader) {
        // TODO Maybe check event.status for error classes 300, 400 or 500
        // so we're not saving false tokens
        const tokenReturned = event.headers.get(tokenHeaderKeyName);
        if (tokenReturned) {
          this.jwtService.saveToken(tokenReturned);
        }
      }
    });
  }
}
