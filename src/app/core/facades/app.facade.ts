import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest, merge, noop } from 'rxjs';
import { filter, map, mapTo, shareReplay, startWith, withLatestFrom } from 'rxjs/operators';

import { getAvailableLocales, getCurrentLocale, getDeviceType, getICMBaseURL } from 'ish-core/store/core/configuration';
import { getGeneralError, getGeneralErrorType } from 'ish-core/store/core/error';
import { selectPath } from 'ish-core/store/core/router';
import { getBreadcrumbData, getHeaderType, getWrapperClass, isStickyHeader } from 'ish-core/store/core/viewconf';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { getAllCountries, getCountriesLoading, loadCountries } from 'ish-core/store/general/countries';
import { getRegionsByCountryCode, loadRegions } from 'ish-core/store/general/regions';
import { getServerConfigParameter } from 'ish-core/store/general/server-config';
import { whenTruthy } from 'ish-core/utils/operators';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  constructor(private store: Store, private router: Router) {
    this.routingInProgress$.subscribe(noop);

    store.pipe(select(getICMBaseURL)).subscribe(icmBaseUrl => (this.icmBaseUrl = icmBaseUrl));
  }
  icmBaseUrl: string;

  headerType$ = this.store.pipe(select(getHeaderType));
  deviceType$ = this.store.pipe(select(getDeviceType));
  stickyHeader$ = this.store.pipe(select(isStickyHeader));

  currentLocale$ = this.store.pipe(select(getCurrentLocale));
  availableLocales$ = this.store.pipe(select(getAvailableLocales));

  generalError$ = this.store.pipe(select(getGeneralError));
  generalErrorType$ = this.store.pipe(select(getGeneralErrorType));
  breadcrumbData$ = this.store.pipe(select(getBreadcrumbData));

  appWrapperClasses$ = combineLatest([
    this.store.pipe(select(getWrapperClass)),
    this.store.pipe(
      select(isStickyHeader),
      map(isSticky => (isSticky ? 'sticky-header' : ''))
    ),
    this.store.pipe(
      select(getDeviceType),
      map(deviceType => (deviceType === 'mobile' ? 'sticky-header' : ''))
    ),
  ]).pipe(map(classes => classes.filter(c => !!c)));

  // COUNTRIES AND REGIONS

  countriesLoading$ = this.store.pipe(select(getCountriesLoading));

  routingInProgress$ = merge(
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
      mapTo(true)
    ),
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      mapTo(false)
    ),
    this.router.events.pipe(
      filter(event => event instanceof NavigationCancel),
      mapTo(false)
    )
  ).pipe(startWith(true), shareReplay(1));
  path$ = this.store.pipe(select(selectPath));

  /**
   * selects whether the current application type is 'REST'. If the application type is unknown it returns true
   */
  isAppTypeREST$ = this.store.pipe(
    select(
      getServerConfigParameter<'intershop.REST' | 'intershop.B2CResponsive' | 'intershop.SMBResponsive'>(
        'application.applicationType'
      )
    ),
    map(appType => appType === 'intershop.REST' || !appType)
  );

  customerRestResource$ = this.isAppTypeREST$.pipe(
    withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
    map(([isRest, customer]) => AppFacade.getCustomerRestResource(!customer || customer.isBusinessCustomer, isRest))
  );

  /**
   * order approval service check
   */

  orderApprovalEnabled$: Observable<boolean> = this.store.pipe(
    select(
      getServerConfigParameter<{
        OrderApprovalServiceDefinition: { runnable: boolean };
      }>('services')
    ),
    whenTruthy(),
    map(services => services.OrderApprovalServiceDefinition && services.OrderApprovalServiceDefinition.runnable)
  );

  static getCustomerRestResource(
    isBusinessCustomer: boolean,
    isAppTypeREST: boolean
  ): 'customers' | 'privatecustomers' {
    return isAppTypeREST && !isBusinessCustomer ? 'privatecustomers' : 'customers';
  }

  countries$() {
    this.store.dispatch(loadCountries());
    return this.store.pipe(select(getAllCountries));
  }

  regions$(countryCode: string) {
    this.store.dispatch(loadRegions({ countryCode }));
    return this.store.pipe(select(getRegionsByCountryCode, { countryCode }));
  }
}
