import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { JwtService } from 'app/shared/services/jwt.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenHeaderKeyName = 'authentication-token';
    const token = this.jwtService.getToken();

    if (token != null) {
      if (req.headers.get('Authorization') == null) {
        req = req.clone({ headers: req.headers.set(tokenHeaderKeyName, token) });
      }
    }

    return next.handle(req).do(event => {
      if (event instanceof HttpResponse) {
        const response = <HttpResponse<any>>event;
        const tokenReturned = response.headers.get(tokenHeaderKeyName);
        console.log('tokenReturned' + tokenReturned);
        if (tokenReturned != null) {
          this.jwtService.saveToken(tokenReturned);
        }
      }
    });
  }
}
