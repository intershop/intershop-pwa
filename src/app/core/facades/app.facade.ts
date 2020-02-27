import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { getICMBaseURL } from 'ish-core/store/configuration';
import { LoadCountries, getAllCountries, getCountriesLoading } from 'ish-core/store/countries';
import { getGeneralError, getGeneralErrorType } from 'ish-core/store/error';
import { getAvailableLocales, getCurrentLocale } from 'ish-core/store/locale';
import { LoadRegions, getRegionsByCountryCode } from 'ish-core/store/regions';
import {
  getBreadcrumbData,
  getDeviceType,
  getHeaderType,
  getWrapperClass,
  isStickyHeader,
} from 'ish-core/store/viewconf';

@Injectable({ providedIn: 'root' })
export class AppFacade {
  constructor(private store: Store<{}>, private location: Location) {}

  currentUrl$ = this.store.pipe(
    select(getICMBaseURL),
    map(baseUrl => baseUrl + this.location.path())
  );

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

  countries$() {
    this.store.dispatch(new LoadCountries());
    return this.store.pipe(select(getAllCountries));
  }

  regions$(countryCode: string) {
    this.store.dispatch(new LoadRegions({ countryCode }));
    return this.store.pipe(select(getRegionsByCountryCode, { countryCode }));
  }
}
