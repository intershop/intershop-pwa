import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { JwtService } from '../services/jwt.service';
import { environment } from './../../environments/environment';

const MOCK_DATA_ROOT = './assets/mock-data';

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  constructor(private jwtService: JwtService) { }

  /**
   * Intercepts out going request and changes url to mock url if needed.
   * Intercepts incoming response and sets authentication-token header if login was requested.
   * @param  {HttpRequest<any>} req
   * @param  {HttpHandler} next
   * @returns  Observable<HttpEvent<any>>
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authorizationHeaderKey = 'Authorization';

    if (this.requestHasToBeMocked(req)) {
      const newUrl = this.getMockUrl(req.url);
      console.log(`redirecting '${req.url}' to '${newUrl}'`);

      const attachToken: boolean = req.headers.has(authorizationHeaderKey) && req.headers.get(authorizationHeaderKey) ===
        // patricia@test.intershop.de with !InterShop00!
        'BASIC cGF0cmljaWFAdGVzdC5pbnRlcnNob3AuZGU6IUludGVyU2hvcDAwIQ==';

      try {
        return next.handle(req.clone({ url: newUrl }));
      } finally {
        if (attachToken) {
          this.jwtService.saveToken('Dummy Token');
        }
      }
    } else {
      return next.handle(req);
    }
  }

  /**
   * transforms server REST URL to mock REST URL
   */
  public getMockUrl(url: string): string {
    return this.urlHasToBeMocked(url) ? `${MOCK_DATA_ROOT}/${this.getRestPath(this.removeQueryStringParameter(url))}/get-data.json` : url;
  }

  private urlHasToBeMocked(url: string): boolean {
    if (url.startsWith(environment.rest_url)) {
      const path = this.getRestPath(url);
      return this.pathHasToBeMocked(path);
    }
    return false;
  }

  /**
   * check if HttpRequest has to be mocked
   */
  public requestHasToBeMocked(req: HttpRequest<any>): boolean {
    return req.method === 'GET' && this.urlHasToBeMocked(req.url);
  }

  public getRestPath(url: string): string {
    const withoutApplication = url.substring(environment.rest_url.length);
    return withoutApplication.substring(withoutApplication.indexOf('/') + 1);
  }

  private pathHasToBeMocked(path: string): boolean {
    return environment.needMock || this.matchPath(path, environment['mustMockPaths']);
  }

  private removeQueryStringParameter(path: string): string {
    return path.split('?')[0];
  }

  public matchPath(requestedPath: string, pathArray: string[]) {
    for (const configPath of pathArray) {
      if (new RegExp('^' + configPath + '$').test(requestedPath)) {
        return true;
      }
    }
    return false;
  }
}
