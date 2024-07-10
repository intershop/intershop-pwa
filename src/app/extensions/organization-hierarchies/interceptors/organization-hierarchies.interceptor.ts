import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, concatMap, first, iif, map, take, withLatestFrom } from 'rxjs';

import { getConfigurationState, getRestEndpoint } from 'ish-core/store/core/configuration';
import { getServerConfigParameter } from 'ish-core/store/core/server-config';
import { whenTruthy } from 'ish-core/utils/operators';

import { getBuyingContext } from '../store/buying-context';

/**
 * HttpInterceptor class for the purpose to enrich the url with parameter in case the request
 * will executed in an organization hierarchies context.
 *
 * Changes in the URL:
 * - adding the buying context in case that customer has selected a organization hierarchies group
 * - change the host and the port regarding the given icm organization hierarchies service configuration
 *   in case the request handles organization hierarchies groups (CRUD operations)
 */
@Injectable()
export class OrganizationHierarchiesInterceptor implements HttpInterceptor {
  // endpoints which require the buying context parameter
  static readonly EFFECTED_BUYING_CONTEXT_ENDPOINTS: string[] = ['/baskets', '/orders'];
  // endpoints which directly communicates with the ohs microserice
  static readonly EFFECTED_ORGANISATION_HIERARCHIES_ENDPOINTS: string[] = ['/organizations'];

  private effectedEndpoint: string;

  constructor(private store: Store) {}

  /**
   * Main method to change the url. To change the url different preconditions have to be checked. At first the icm organization hierarchies service
   * has to run. Second requests that contain the specific REST endpoints are processed. Also has to check that the organization hierarchies store
   * is available.Because in case that no customer is currently logged in this store element is not there.
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let featureEnabled = false;
    this.store
      .pipe(
        select(getServerConfigParameter<boolean>('services.OrganizationHierarchyServiceDefinition.runnable')),
        whenTruthy(),
        take(1)
      )
      .subscribe(runnable => (featureEnabled = runnable));

    return featureEnabled && this.isRequestAffected(req.url) ? this.apply(req, next) : next.handle(req);
  }

  /**
   *  Method checks if the current request contains the specific REST endpoints.
   */
  isRequestAffected(url: string): boolean {
    this.setEndpoint(undefined);
    OrganizationHierarchiesInterceptor.EFFECTED_ORGANISATION_HIERARCHIES_ENDPOINTS.find(endpoint =>
      this.urlContainsInList(endpoint, url)
    );

    if (this.getEndpoint()) {
      return true;
    }
    OrganizationHierarchiesInterceptor.EFFECTED_BUYING_CONTEXT_ENDPOINTS.find(endpoint =>
      this.urlContainsInList(endpoint, url)
    );
    if (this.getEndpoint()) {
      return true;
    }

    return false;
  }

  private urlContainsInList(effectedEndpoint: string, url: string) {
    if (url.includes(effectedEndpoint)) {
      this.setEndpoint(effectedEndpoint);
      return true;
    }
    return false;
  }

  private getEndpoint(): string {
    return this.effectedEndpoint;
  }

  private setEndpoint(endpoint: string) {
    this.effectedEndpoint = endpoint;
  }

  /**
   * Method will only called if conditions are satisfied. Depending on which conditions are met the corresponding
   * resolve method will executed.
   */
  apply(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (OrganizationHierarchiesInterceptor.EFFECTED_BUYING_CONTEXT_ENDPOINTS.includes(this.getEndpoint())) {
      return this.resolveBuyingContext(req, next);
    }
    if (OrganizationHierarchiesInterceptor.EFFECTED_ORGANISATION_HIERARCHIES_ENDPOINTS.includes(this.getEndpoint())) {
      return this.resolveRedirect(req, next);
    }

    return next.handle(req);
  }

  /**
   * Method to change the host and the port regarding the given icm organization hierarchies service configuration endpoint.
   * This endpoint value contains information about the host/port of the ohs microservice.
   */
  resolveRedirect(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let externalURL: string;
    this.store
      .pipe(
        select(getServerConfigParameter<string>('services.OrganizationHierarchyServiceDefinition.Endpoint')),
        take(1)
      )
      .subscribe(url => (externalURL = url));
    const cloneReq = req.clone({
      url: externalURL.concat(req.url.substring(req.url.indexOf(this.getEndpoint()))),
    });
    return next.handle(cloneReq);
  }

  /**
   * Method to enrich the request url with the current selected buying context.
   */
  resolveBuyingContext(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const matrixparam = 'bctx';
    return this.store.pipe(
      first(),
      concatMap((store: { organizationHierarchies: unknown }) =>
        iif(
          () => !!store.organizationHierarchies,
          this.store.pipe(
            select(getBuyingContext),
            withLatestFrom(this.store.pipe(select(getRestEndpoint)), this.store.pipe(select(getConfigurationState))),
            map(([buyingcontext, baseurl, configuration]) =>
              buyingcontext.bctx && !req?.url.includes(matrixparam) && req?.url.includes(configuration.channel)
                ? req.clone({
                    url: req.url
                      .substring(0, baseurl.length)
                      .concat(';', matrixparam, '=', buyingcontext.bctx, req.url.substring(baseurl.length)),
                  })
                : req
            ),
            first(),
            concatMap(request => next.handle(request))
          ),
          next.handle(req)
        )
      )
    );
  }
}
