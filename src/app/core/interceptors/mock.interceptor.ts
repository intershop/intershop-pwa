// tslint:disable:no-any
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { MUST_MOCK_PATHS, NEED_MOCK } from '../../core/configurations/injection-keys';
import { REST_ENDPOINT } from '../../core/services/state-transfer/factories';

const MOCK_DATA_ROOT = './assets/mock-data';

/**
 * redirects a given request to the REST API to mocked data depending on mock settings
 */
@Injectable()
export class MockInterceptor implements HttpInterceptor {
  constructor(
    @Inject(REST_ENDPOINT) private restEndpoint: string,
    @Inject(NEED_MOCK) private needMock: boolean,
    @Inject(MUST_MOCK_PATHS) private mustMockPaths: string[]
  ) {}

  /**
   * Intercepts out going request and changes url to mock url if needed.
   * Intercepts incoming response and sets authentication-token header if login was requested.
   * Also handles logging in patricia with correct password and failing if credentials are wrong
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

    return next.handle(req.clone({ url: newUrl, method: 'GET' })).pipe(
      flatMap(event => {
        if (event instanceof HttpResponse) {
          if (this.isLoginAttempt(req) && !this.isMockUserLoggingInSuccessfully(req)) {
            return throwError(
              new HttpErrorResponse({
                status: 401,
                error: 'wrong credentials',
                headers: new HttpHeaders({ 'error-key': 'account.login.email_password.error.invalid' }),
              })
            );
          }
          return of(this.attachTokenIfNecessary(req, event));
        }
        return of(event);
      })
    );
  }

  private isLoginAttempt(req: HttpRequest<any>) {
    return req.headers.has('Authorization');
  }

  /**
   * check if user patricia@test.intershop.de with !InterShop00! is logged in correctly
   */
  private isMockUserLoggingInSuccessfully(req: HttpRequest<any>) {
    return req.headers.get('Authorization') === 'BASIC cGF0cmljaWFAdGVzdC5pbnRlcnNob3AuZGU6IUludGVyU2hvcDAwIQ==';
  }

  /**
   * Decides if token needs to be attached and attaches it
   */
  private attachTokenIfNecessary(req: HttpRequest<any>, response: HttpResponse<any>): HttpResponse<any> {
    if ((this.isLoginAttempt(req) && this.isMockUserLoggingInSuccessfully(req)) || req.url.indexOf('customers') > -1) {
      console.log('attaching dummy token');
      return response.clone({ headers: response.headers.append('authentication-token', 'Dummy Token') });
    }
    return response;
  }

  /**
   * transforms server REST URL to mock REST URL
   */
  getMockUrl(req: HttpRequest<any>) {
    return this.urlHasToBeMocked(req.url)
      ? `${MOCK_DATA_ROOT}/${this.getRestPath(
          this.removeQueryStringParameter(req.url)
        )}/${req.method.toLocaleLowerCase()}${this.sanitizeParams(req.params)}.json`
      : req.url;
  }

  private sanitize(value: string): string {
    return value.replace(/[^a-zA-Z0-9-]/g, '_');
  }

  private sanitizeParams(params: HttpParams): string {
    return !params
      ? ''
      : params
          .keys()
          .sort((a, b) => a.localeCompare(b))
          .map(key => `${this.sanitize(key)}_${this.sanitize(params.get(key))}`)
          .reduce((a, b) => a + '_' + b, '');
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
  requestHasToBeMocked(req: HttpRequest<any>): boolean {
    return this.urlHasToBeMocked(req.url);
  }

  getRestPath(url: string): string {
    const withoutApplication = url.substring(this.restEndpoint.length);
    return withoutApplication.substring(withoutApplication.indexOf('/') + 1);
  }

  private pathHasToBeMocked(path: string): boolean {
    return this.needMock || this.matchPath(path, this.mustMockPaths);
  }

  private removeQueryStringParameter(path: string): string {
    return path.split('?')[0];
  }

  matchPath(requestedPath: string, pathArray: string[]) {
    pathArray = pathArray || [];
    for (const configPath of pathArray) {
      if (new RegExp('^' + configPath + '$').test(requestedPath)) {
        return true;
      }
    }
    return false;
  }
}
