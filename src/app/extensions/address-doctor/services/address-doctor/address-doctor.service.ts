import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, catchError, map, of, switchMap, take, throwError } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { AddressDoctorVariants } from '../../models/address-doctor/address-doctor.interface';
import { AddressDoctorMapper } from '../../models/address-doctor/address-doctor.mapper';
import { getAddressDoctorConfig } from '../../store/address-doctor';

@Injectable({ providedIn: 'root' })
export class AddressDoctorService {
  private http = inject(HttpClient);
  private store = inject(Store);

  postAddress(address: Address): Observable<Address[]> {
    let addressLine = '';

    if (address.addressLine2) {
      addressLine = `${address.addressLine1};${address.addressLine2};${address.postalCode};${address.city}`;
    } else {
      addressLine = `${address.addressLine1};${address.postalCode};${address.city}`;
    }

    return this.mapToBody(address, addressLine).pipe(
      whenTruthy(),
      switchMap(({ url, body }) =>
        this.http.post(url, body).pipe(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map<any, AddressDoctorVariants[]>((body: any) => {
            if (body?.Status !== 'Ok') {
              return throwError(() => body?.StatusDescription);
            }
            return body.Response[0].Results;
          }),
          map(results => results.map(result => ({ ...address, ...AddressDoctorMapper.fromData(result.Variants[0]) }))),
          // should return empty suggestions in case an error occurs
          catchError(() => of([]))
        )
      )
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToBody(address: Address, addressLine: string): Observable<{ url: string; body: any }> {
    return this.store.pipe(
      select(getAddressDoctorConfig),
      whenTruthy(),
      take(1),
      map(config => ({
        url: config.url,
        body: {
          Login: config.login,
          Password: config.password,
          UseTransactions: 'PRODUCTION',
          Request: {
            Parameters: {
              Mode: 'QuickCapture',

              CountrySets: [
                {
                  OutputDetail: {
                    PreformattedData: {
                      PostalFormattedAddressLines: true,
                      SingleAddressLine: true,
                      SingleAddressLineDelimiter: 'Semicolon',
                    },
                    SubItems: true,
                  },
                  Result: {
                    MaxResultCount: config.maxResultCount,
                    NumericRangeExpansion: {
                      RangesToExpand: 'None',
                      RangeExpansionType: 'Flexible',
                    },
                  },
                  Standardizations: [
                    {
                      Default: {
                        PreferredScript: {
                          Script: 'Latin',
                          TransliterationType: 'Default',
                          LimitLatinCharacters: 'Latin1',
                        },
                        FormatWithCountry: false,
                        CountryNameType: 'NameEN',
                        CountryCodeType: 'ISO2',
                        MaxItemLength: 255,
                        Casing: 'PostalAdmin',
                        DescriptorLength: 'Database',
                        AliasHandling: 'PostalAdmin',
                      },
                    },
                  ],
                },
              ],
            },

            IO: {
              Inputs: [
                {
                  AddressElements: {
                    Country: address.countryCode,
                  },
                  PreformattedData: {
                    SingleAddressLine: addressLine,
                  },
                },
              ],
            },
          },
        },
      }))
    );
  }
}
