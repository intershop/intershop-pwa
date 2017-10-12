import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

const MOCK_DATA_ROOT = './assets/mock-data';

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  constructor() { }

  /**
   * Intercepts out going request and changes url to mock url if needed.
   * Intercepts incoming response and sets authentication-token header if login was requested.
   * @param  {HttpRequest<any>} req
   * @param  {HttpHandler} next
   * @returns  Observable<HttpEvent<any>>
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.requestHasToBeMocked(req)) {
      return next.handle(req);
    }
    const newUrl = this.getMockUrl(req);
    req = this.modifyRequestMethod(req);
    console.log(`redirecting '${req.url}' to '${newUrl}'`);

    return next.handle(req.clone({ url: newUrl })).map(event => {
      if (event instanceof HttpResponse && this.attachToken(req)) {
        const response = <HttpResponse<any>>event;
        console.log('attaching dummy token');
        return response.clone({ headers: response.headers.append('authentication-token', 'Dummy Token') });
      }
      return event;
    });
  }

  modifyRequestMethod(req) {
    const GET = 'GET';
    if (req.method !== GET) {
      req = new HttpRequest(GET, req.url);
    }
    return req;
  }


  /**
   * Decides if token needs to be attached
   * @param  {} req
   * @returns boolean
   */
  attachToken(req): boolean {
    const authorizationHeaderKey = 'Authorization';
    return req.headers.has(authorizationHeaderKey) && req.headers.get(authorizationHeaderKey) ===
      // patricia@test.intershop.de with !InterShop00!
      'BASIC cGF0cmljaWFAdGVzdC5pbnRlcnNob3AuZGU6IUludGVyU2hvcDAwIQ==' || req.url.indexOf('createUser') > -1;
  }

  /**
   * transforms server REST URL to mock REST URL
   */
  public getMockUrl(req: HttpRequest<any>) {
    return this.urlHasToBeMocked(req.url) ? `${MOCK_DATA_ROOT}/${this.getRestPath(this.removeQueryStringParameter(req.url))}/${req.method.toLocaleLowerCase()}-data.json` : req.url;
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
    return this.urlHasToBeMocked(req.url);
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
