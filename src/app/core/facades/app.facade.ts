import { getCurrencySymbol } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { combineLatest, merge, noop } from 'rxjs';
import { filter, map, sample, shareReplay, startWith, withLatestFrom } from 'rxjs/operators';

import {
  getAvailableLocales,
  getCurrentCurrency,
  getCurrentLocale,
  getDeviceType,
  getICMBaseURL,
  getPipelineEndpoint,
  getRestEndpoint,
} from 'ish-core/store/core/configuration';
import { businessError, getGeneralError, getGeneralErrorType } from 'ish-core/store/core/error';
import { selectPath } from 'ish-core/store/core/router';
import { getExtraConfigParameter, getServerConfigParameter } from 'ish-core/store/core/server-config';
import { getBreadcrumbData, getHeaderType, getWrapperClass, isStickyHeader } from 'ish-core/store/core/viewconf';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { getAllCountries, loadCountries } from 'ish-core/store/general/countries';
import { getRegionsByCountryCode, loadRegions } from 'ish-core/store/general/regions';
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
  currentCurrency$ = this.store.pipe(select(getCurrentCurrency));

  generalError$ = this.store.pipe(select(getGeneralError));
  generalErrorType$ = this.store.pipe(select(getGeneralErrorType));
  breadcrumbData$ = this.store.pipe(select(getBreadcrumbData));

  getRestEndpoint$ = this.store.pipe(select(getRestEndpoint));
  getPipelineEndpoint$ = this.store.pipe(select(getPipelineEndpoint));

  appWrapperClasses$ = combineLatest([
    this.store.pipe(
      select(getWrapperClass),
      sample(this.router.events.pipe(filter(event => event instanceof NavigationEnd)))
    ),
    this.store.pipe(
      select(isStickyHeader),
      map(isSticky => (isSticky ? 'sticky-header' : ''))
    ),
    this.store.pipe(
      select(getDeviceType),
      map(deviceType => (deviceType === 'mobile' ? 'sticky-header' : ''))
    ),
  ]).pipe(map(classes => classes.filter(c => !!c)));

  routingInProgress$ = merge(
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
      map(() => true)
    ),
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => false)
    ),
    this.router.events.pipe(
      filter(event => event instanceof NavigationCancel),
      map(() => false)
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

  static getCustomerRestResource(
    isBusinessCustomer: boolean,
    isAppTypeREST: boolean
  ): 'customers' | 'privatecustomers' {
    return isAppTypeREST && !isBusinessCustomer ? 'privatecustomers' : 'customers';
  }

  setBusinessError(error: string) {
    this.store.dispatch(businessError({ error }));
  }

  /**
   * extracts a specific server setting from the store.
   *
   * @param path the path to the server setting, starting from the serverConfig/_config store.
   */
  serverSetting$<T>(path: string) {
    return this.store.pipe(select(getServerConfigParameter<T>(path)));
  }

  // not-dead-code
  /**
   * extracts a specific extra server setting from the store (intended for custom ConfigurationJSON)
   *
   * @param path the path to the server setting, starting from the serverConfig/extra store
   */
  extraSetting$<T>(path: string) {
    return this.store.pipe(select(getExtraConfigParameter<T>(path)));
  }

  /**
   * returns the currency symbol for the currency parameter in the current locale.
   * If no parameter is given, the the default currency is taken instead of it.
   *
   * @param currency The currency
   */
  currencySymbol$(currency?: string) {
    return this.currentLocale$.pipe(
      whenTruthy(),
      withLatestFrom(this.currentCurrency$),
      map(([locale, defaultCurrency]) => getCurrencySymbol(currency || defaultCurrency, 'narrow', locale))
    );
  }

  countries$() {
    this.store.dispatch(loadCountries());
    return this.store.pipe(select(getAllCountries));
  }

  regions$(countryCode: string) {
    this.store.dispatch(loadRegions({ countryCode }));
    return this.store.pipe(select(getRegionsByCountryCode(countryCode)));
  }
}
