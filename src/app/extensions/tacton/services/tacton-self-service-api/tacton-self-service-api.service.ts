import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import { first, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { getLoggedInCustomer, getLoggedInUser } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';

import { TactonProductConfiguration } from '../../models/tacton-product-configuration/tacton-product-configuration.model';
import { TactonSavedConfiguration } from '../../models/tacton-saved-configuration/tacton-saved-configuration.model';
import { TactonSelfServiceApiConfiguration } from '../../models/tacton-self-service-api-configuration/tacton-self-service-api-configuration.model';
import { getCurrentProductConfiguration } from '../../store/product-configuration';
import { getNewExternalId, getSelfServiceApiConfiguration } from '../../store/tacton-config';

@Injectable({ providedIn: 'root' })
export class TactonSelfServiceApiService {
  constructor(private http: HttpClient, private store: Store) {}

  private constructAPIAuth(config: TactonSelfServiceApiConfiguration, externalId: string): string {
    return `_key=${config.apiKey}` + (externalId ? `&_externalId=` + externalId : '');
  }

  private addConfigReference(config: Partial<TactonProductConfiguration>): string {
    return config.configId ? `&configId=${config.configId}` : `&configState=${encodeURIComponent(config.configState)}`;
  }

  startConfiguration(productPath: string): Observable<TactonProductConfiguration> {
    if (!productPath) {
      return EMPTY;
    }
    return this.store.pipe(
      select(getSelfServiceApiConfiguration),
      whenTruthy(),
      first(),
      withLatestFrom(this.store.pipe(select(getNewExternalId))),
      switchMap(([config, externalId]) =>
        this.http
          .post<TactonProductConfiguration>(
            `${config.endPoint}/config/start/${productPath}`,
            this.constructAPIAuth(config, externalId),
            {
              headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            }
          )
          .pipe(switchMap(result => this.getBOM(result).pipe(map(bom => ({ ...result, bom: bom.bom, externalId })))))
      )
    );
  }

  continueConfiguration(savedConfiguration: TactonSavedConfiguration): Observable<TactonProductConfiguration> {
    if (!savedConfiguration) {
      return EMPTY;
    }
    if (!savedConfiguration.step) {
      return this.startConfiguration(savedConfiguration.productId);
    }
    return this.store.pipe(
      select(getSelfServiceApiConfiguration),
      whenTruthy(),
      first(),
      switchMap(config =>
        this.http
          .post<TactonProductConfiguration>(
            `${config.endPoint}/config/step`,
            // tslint:disable-next-line: prefer-template
            this.constructAPIAuth(config, savedConfiguration.externalId) +
              this.addConfigReference(savedConfiguration) +
              `&step=${savedConfiguration.step}`,
            {
              headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            }
          )
          .pipe(
            switchMap(result =>
              this.getBOM(result).pipe(
                map(bom => ({ ...result, bom: bom.bom, externalId: savedConfiguration.externalId }))
              )
            )
          )
      )
    );
  }

  commitValue(valueId: string, value: string): Observable<TactonProductConfiguration> {
    return this.store.pipe(
      select(getCurrentProductConfiguration),
      whenTruthy(),
      first(),
      withLatestFrom(this.store.pipe(select(getSelfServiceApiConfiguration))),
      switchMap(([config, selfService]) =>
        this.http
          .post<TactonProductConfiguration>(
            `${selfService.endPoint}/config/commit/${valueId}/${value}`,
            this.constructAPIAuth(selfService, config.externalId) + this.addConfigReference(config),
            {
              headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            }
          )
          .pipe(
            switchMap(result =>
              this.getBOM(result).pipe(map(bom => ({ ...result, bom: bom.bom, externalId: config.externalId })))
            )
          )
      )
    );
  }

  uncommitValue(valueId: string): Observable<TactonProductConfiguration> {
    return this.store.pipe(
      select(getCurrentProductConfiguration),
      whenTruthy(),
      first(),
      withLatestFrom(this.store.pipe(select(getSelfServiceApiConfiguration))),
      switchMap(([config, selfService]) =>
        this.http
          .post<TactonProductConfiguration>(
            `${selfService.endPoint}/config/uncommit/${valueId}`,
            this.constructAPIAuth(selfService, config.externalId) + this.addConfigReference(config),
            {
              headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            }
          )
          .pipe(
            switchMap(result =>
              this.getBOM(result).pipe(map(bom => ({ ...result, bom: bom.bom, externalId: config.externalId })))
            )
          )
      )
    );
  }

  acceptConflictResolution(valueId: string, value: string): Observable<TactonProductConfiguration> {
    if (!valueId) {
      return EMPTY;
    }
    return this.store.pipe(
      select(getCurrentProductConfiguration),
      whenTruthy(),
      first(),
      withLatestFrom(this.store.pipe(select(getSelfServiceApiConfiguration))),
      switchMap(([config, selfService]) =>
        this.http
          .post<TactonProductConfiguration>(
            `${selfService.endPoint}/config/accept`,
            // tslint:disable-next-line: prefer-template
            this.constructAPIAuth(selfService, config.externalId) +
              this.addConfigReference(config) +
              `&parameter=${valueId}&value=${value}`,
            {
              headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            }
          )
          .pipe(
            switchMap(result =>
              this.getBOM(result).pipe(
                map(bom => ({
                  ...result,
                  bom: bom.bom,
                  externalId: config.externalId,
                  // override faulty API response
                  response: { status: 'OK' as 'OK' },
                }))
              )
            )
          )
      )
    );
  }

  private getBOM(config: TactonProductConfiguration): Observable<TactonProductConfiguration> {
    if (config.bom) {
      return of(config);
    }
    return this.store.pipe(
      select(getSelfServiceApiConfiguration),
      whenTruthy(),
      first(),
      switchMap(selfService =>
        this.http.get<TactonProductConfiguration>(
          `${selfService.endPoint}/config/bom?_key=${selfService.apiKey}` + this.addConfigReference(config)
        )
      )
    );
  }

  changeStep(step: string): Observable<TactonProductConfiguration> {
    if (!step) {
      return EMPTY;
    }
    return this.store.pipe(
      select(getCurrentProductConfiguration),
      whenTruthy(),
      first(),
      withLatestFrom(this.store.pipe(select(getSelfServiceApiConfiguration))),
      switchMap(([config, selfService]) =>
        this.http
          .post<TactonProductConfiguration>(
            `${selfService.endPoint}/config/step`,
            // TODO: refactor
            // tslint:disable-next-line: prefer-template
            this.constructAPIAuth(selfService, config.externalId) + this.addConfigReference(config) + `&step=${step}`,
            {
              headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            }
          )
          .pipe(
            switchMap(result =>
              this.getBOM(result).pipe(map(bom => ({ ...result, bom: bom.bom, externalId: config.externalId })))
            )
          )
      )
    );
  }

  submitConfiguration(savedConfiguration: TactonSavedConfiguration) {
    if (!savedConfiguration) {
      return EMPTY;
    } else {
      return this.store.pipe(
        select(getSelfServiceApiConfiguration),
        whenTruthy(),
        first(),
        switchMap(config =>
          this.http
            .post(
              `${config.endPoint}/cart/items`,
              // tslint:disable-next-line: prefer-template
              this.constructAPIAuth(config, savedConfiguration.externalId) +
                this.addConfigReference(savedConfiguration) +
                `&qty=1`,
              {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
              }
            )
            .pipe(
              withLatestFrom(this.store.pipe(select(getLoggedInUser)), this.store.pipe(select(getLoggedInCustomer))),
              switchMap(([, user, customer]) =>
                this.http
                  .put(
                    `${config.endPoint}/cart`,
                    // tslint:disable-next-line: prefer-template
                    this.constructAPIAuth(config, savedConfiguration.externalId) +
                      `&customerEmail=${user.login}&customerPhoneNumber=${user.phoneHome || 'N/A'}&customerName=${
                        customer.companyName
                      } - ${user.firstName} ${user.lastName}`,
                    {
                      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
                    }
                  )
                  .pipe(
                    switchMap(() =>
                      this.http.post(
                        `${config.endPoint}/proposal/firm-requests`,
                        this.constructAPIAuth(config, savedConfiguration.externalId),
                        {
                          headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
                        }
                      )
                    )
                  )
              )
            )
        )
      );
    }
  }
}
