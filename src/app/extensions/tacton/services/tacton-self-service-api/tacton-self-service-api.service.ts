import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { pick } from 'lodash-es';
import { EMPTY, Observable } from 'rxjs';
import { concatMap, first, map, withLatestFrom } from 'rxjs/operators';

import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

import { TactonProductConfiguration } from '../../models/tacton-product-configuration/tacton-product-configuration.model';
import { TactonSavedConfiguration } from '../../models/tacton-saved-configuration/tacton-saved-configuration.model';
import { TactonSelfServiceApiConfiguration } from '../../models/tacton-self-service-api-configuration/tacton-self-service-api-configuration.model';
import { getCurrentProductConfiguration } from '../../store/product-configuration';
import { getNewExternalId, getSelfServiceApiConfiguration } from '../../store/tacton-config';

@Injectable({ providedIn: 'root' })
export class TactonSelfServiceApiService {
  private static FORM_URLENCODED_HEADERS = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

  constructor(private http: HttpClient, private store: Store) {}

  private apiConfig$(parameters?: { externalId?: string }) {
    return this.store.pipe(
      select(getSelfServiceApiConfiguration),
      whenTruthy(),
      first(),
      withLatestFrom(
        this.store.pipe(
          select(getNewExternalId),
          map(externalId => parameters?.externalId || externalId)
        )
      )
    );
  }

  private constructParameters(
    config: TactonSelfServiceApiConfiguration,
    externalId: string,
    parameters?: { [key: string]: string }
  ): string {
    return Object.keys(parameters || {})
      .filter(k => k !== 'externalId')
      .reduce(
        (acc, val) => acc.set(val, parameters[val]),
        new HttpParams().set('_key', config.apiKey).set('_externalId', externalId)
      )
      .toString();
  }

  private post<T>(resource: string, parameters?: { [key: string]: string }): Observable<T> {
    return this.apiConfig$(parameters).pipe(
      concatMap(([config, externalId]) =>
        this.http
          .post<T>(
            `${config.endPoint}/self-service-api/${resource}`,
            this.constructParameters(config, externalId, parameters),
            { headers: TactonSelfServiceApiService.FORM_URLENCODED_HEADERS }
          )
          .pipe(map(result => ({ ...result, externalId })))
      )
    );
  }

  private put<T>(resource: string, parameters?: { [key: string]: string }): Observable<T> {
    return this.apiConfig$(parameters).pipe(
      concatMap(([config, externalId]) =>
        this.http
          .put<T>(
            `${config.endPoint}/self-service-api/${resource}`,
            this.constructParameters(config, externalId, parameters),
            { headers: TactonSelfServiceApiService.FORM_URLENCODED_HEADERS }
          )
          .pipe(map(result => ({ ...result, externalId })))
      )
    );
  }

  private postConfig<T = TactonProductConfiguration>(
    resource: string,
    parameters?: { [key: string]: string }
  ): Observable<T> {
    return this.store.pipe(
      select(getCurrentProductConfiguration),
      whenTruthy(),
      first(),
      concatMap(config => this.post<T>(resource, { ...pick(config, 'configId', 'externalId'), ...parameters }))
    );
  }

  startConfiguration(productPath: string): Observable<TactonProductConfiguration> {
    if (!productPath) {
      return EMPTY;
    }
    return this.post<TactonProductConfiguration>(`config/start/${productPath}`);
  }

  continueConfiguration(savedConfiguration: TactonSavedConfiguration): Observable<TactonProductConfiguration> {
    if (!savedConfiguration) {
      return EMPTY;
    }
    if (!savedConfiguration.step) {
      return this.startConfiguration(savedConfiguration.productId);
    }
    return this.post('config/step', pick(savedConfiguration, 'externalId', 'step', 'configId'));
  }

  commitValue(valueId: string, value: string): Observable<TactonProductConfiguration> {
    return this.postConfig(`config/commit/${valueId}/${value}`);
  }

  uncommitValue(valueId: string): Observable<TactonProductConfiguration> {
    return this.postConfig(`config/uncommit/${valueId}`);
  }

  acceptConflictResolution(valueId: string, value: string): Observable<TactonProductConfiguration> {
    if (!valueId) {
      return EMPTY;
    }
    return this.postConfig('config/accept', { parameter: valueId, value }).pipe(
      map(result => ({
        ...result,
        // override faulty API response
        response: { status: 'OK' as 'OK' },
      }))
    );
  }

  changeStep(step: string): Observable<TactonProductConfiguration> {
    if (!step) {
      return EMPTY;
    }
    return this.postConfig('config/step', { step });
  }

  submitConfiguration(savedConfiguration: TactonSavedConfiguration) {
    if (!savedConfiguration) {
      return EMPTY;
    } else {
      return this.post('cart/items', { ...pick(savedConfiguration, 'externalId', 'configId'), qty: '1' }).pipe(
        withLatestFrom(this.store.pipe(select(getLoggedInUser)), this.store.pipe(select(getLoggedInCustomer))),
        concatMap(([, user, customer]) =>
          this.put('cart', {
            externalId: savedConfiguration.externalId,
            customerEmail: user.login,
            customerPhoneNumber: user.phoneHome || 'N/A',
            customerName: `${customer.companyName} - ${user.firstName} ${user.lastName}`,
          }).pipe(
            concatMap(() =>
              this.post('proposal/firm-requests', {
                externalId: savedConfiguration.externalId,
              })
            )
          )
        )
      );
    }
  }
}
