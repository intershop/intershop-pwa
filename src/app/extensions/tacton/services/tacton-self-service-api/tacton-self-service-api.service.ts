import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import { first, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { TactonProductConfiguration } from '../../models/tacton-product-configuration/tacton-product-configuration.model';
import { TactonSelfServiceApiConfiguration } from '../../models/tacton-self-service-api-configuration/tacton-self-service-api-configuration.model';
import { getCurrentProductConfiguration } from '../../store/product-configuration';
import { getExternalId, getSelfServiceApiConfiguration } from '../../store/tacton-config';

@Injectable({ providedIn: 'root' })
export class TactonSelfServiceApiService {
  constructor(private http: HttpClient, private store: Store) {}

  private constructAPIAuth(config: TactonSelfServiceApiConfiguration, externalId: string): string {
    return `_key=${config.apiKey}` + (externalId ? `&_externalId=` + externalId : '');
  }

  private addConfigReference(config: TactonProductConfiguration): string {
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
      withLatestFrom(this.store.pipe(select(getExternalId))),
      switchMap(([config, externalId]) =>
        this.http
          .post<TactonProductConfiguration>(
            `${config.endPoint}/config/start/${productPath}`,
            this.constructAPIAuth(config, externalId),
            {
              headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            }
          )
          .pipe(switchMap(result => this.getBOM(result).pipe(map(bom => ({ ...result, bom: bom.bom })))))
      )
    );
  }

  commitValue(valueId: string, value: string): Observable<TactonProductConfiguration> {
    return this.store.pipe(
      select(getCurrentProductConfiguration),
      whenTruthy(),
      first(),
      withLatestFrom(this.store.pipe(select(getSelfServiceApiConfiguration)), this.store.pipe(select(getExternalId))),
      switchMap(([config, selfService, externalId]) =>
        this.http
          .post<TactonProductConfiguration>(
            `${selfService.endPoint}/config/commit/${valueId}/${value}`,
            this.constructAPIAuth(selfService, externalId) + this.addConfigReference(config),
            {
              headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            }
          )
          .pipe(switchMap(result => this.getBOM(result).pipe(map(bom => ({ ...result, bom: bom.bom })))))
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
      withLatestFrom(this.store.pipe(select(getSelfServiceApiConfiguration)), this.store.pipe(select(getExternalId))),
      switchMap(([config, selfService, externalId]) =>
        this.http
          .post<TactonProductConfiguration>(
            `${selfService.endPoint}/config/step`,
            // TODO: refactor
            // tslint:disable-next-line: prefer-template
            this.constructAPIAuth(selfService, externalId) + this.addConfigReference(config) + `&step=${step}`,
            {
              headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            }
          )
          .pipe(switchMap(result => this.getBOM(result).pipe(map(bom => ({ ...result, bom: bom.bom })))))
      )
    );
  }
}
