import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MUST_MOCK_PATHS, NEED_MOCK } from '../../core/configurations/injection-keys';
import { REST_ENDPOINT } from '../../core/services/state-transfer/factories';

const MOCK_DATA_ROOT = './assets/mock-data';

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  constructor(
    @Inject(REST_ENDPOINT) private restEndpoint: string,
    @Inject(NEED_MOCK) private needMock: boolean,
    @Inject(MUST_MOCK_PATHS) private mustMockPaths: string[]
  ) { }

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
    console.log(`redirecting '${req.url}' to '${newUrl}'`);

    return next.handle(req.clone({ url: newUrl, method: 'GET' })).map(event => {
      if (event instanceof HttpResponse) {
        const response = <HttpResponse<any>>event;
        return this.attachTokenIfNecessary(req, response);
      }
      return event;
    });
  }

  /**
   * check if user patricia@test.intershop.de with !InterShop00! is logged in correctly
   */
  private mockUserIsLoggingIn(req: HttpRequest<any>) {
    const authorizationHeaderKey = 'Authorization';
    return req.headers.has(authorizationHeaderKey) && req.headers.get(authorizationHeaderKey) ===
      'BASIC cGF0cmljaWFAdGVzdC5pbnRlcnNob3AuZGU6IUludGVyU2hvcDAwIQ==';
  }

  /**
   * Decides if token needs to be attached and attaches it
   */
  private attachTokenIfNecessary(req: HttpRequest<any>, response: HttpResponse<any>): HttpResponse<any> {
    if (this.mockUserIsLoggingIn(req) || req.url.indexOf('createUser') > -1) {
      console.log('attaching dummy token');
      return response.clone({ headers: response.headers.append('authentication-token', 'Dummy Token') });
    }
    return response;
  }

  /**
   * transforms server REST URL to mock REST URL
   */
  public getMockUrl(req: HttpRequest<any>) {
    return this.urlHasToBeMocked(req.url) ? `${MOCK_DATA_ROOT}/${this.getRestPath(this.removeQueryStringParameter(req.url))}/${req.method.toLocaleLowerCase()}-data.json` : req.url;
  }

  private urlHasToBeMocked(url: string): boolean {
    if (url.startsWith(this.restEndpoint)) {
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
    const withoutApplication = url.substring(this.restEndpoint.length);
    return withoutApplication.substring(withoutApplication.indexOf('/') + 1);
  }

  private pathHasToBeMocked(path: string): boolean {
    return this.needMock || this.matchPath(path, this.mustMockPaths);
  }

  private removeQueryStringParameter(path: string): string {
    return path.split('?')[0];
  }

  public matchPath(requestedPath: string, pathArray: string[]) {
    pathArray = pathArray || [];
    for (const configPath of pathArray) {
      if (new RegExp('^' + configPath + '$').test(requestedPath)) {
        return true;
      }
    }
    return false;
  }
}
