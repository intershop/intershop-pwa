import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';

@Injectable({ providedIn: 'root' })
export class FormsService {
  constructor(private translate: TranslateService, private store: Store) {}

  /**
   * Gets all possible salutation options for a certain country.
   * @param translate instance of a translation service
   * @param countryCode country code of the country for which the salutations should be determined.
   * @returns salutation select options
   */
  getSalutationOptionsForCountryCode(countryCode: string): SelectOption[] {
    return this.determineSalutations(countryCode).map(title => ({
      value: this.translate.instant(title),
      label: title,
    }));
  }

  /**
   * Gets all possible salutation options for the current locale.
   * @param  appFacade instance of the an application facade
   * @param translate instance of a translation service
   * @returns salutation select options
   */
  getSalutationOptions(): Observable<SelectOption[]> {
    return this.store.pipe(select(getCurrentLocale)).pipe(
      whenTruthy(),
      map(locale => this.getSalutationOptionsForCountryCode(locale?.substring(3)))
    );
  }

  /**
   * Get address select options for addresses in order to render them in an address select box.
   * @param addresses
   * @returns address select options
   */
  getAddressOptions(addresses$: Observable<Address[]>): Observable<SelectOption[]> {
    return addresses$.pipe(
      whenTruthy(),
      map(addresses =>
        addresses.map(a => ({
          label: `${a.firstName} ${a.lastName}, ${a.addressLine1}, ${a.city}`,
          value: a.id,
        }))
      )
    );
  }

  /**
   * Gets all possible salutations for a certain country.
   * @param countryCode country code of the country for which the salutations should be determined.
   * @returns translation keys of the salutations
   */
  private determineSalutations(countryCode: string): string[] {
    // TODO: should come from configuration?
    let salutationLabels: string[] = [];

    switch (countryCode) {
      case 'DE': {
        salutationLabels = ['account.salutation.ms.text', 'account.salutation.mr.text', 'account.salutation.dr.text'];
        break;
      }
      case 'FR': {
        salutationLabels = ['account.salutation.ms.text', 'account.salutation.mr.text', 'account.salutation.dr.text'];
        break;
      }
      case 'US': {
        salutationLabels = ['account.salutation.ms.text', 'account.salutation.mr.text', 'account.salutation.dr.text'];
        break;
      }
      case 'GB': {
        salutationLabels = ['account.salutation.ms.text', 'account.salutation.mr.text', 'account.salutation.dr.text'];
        break;
      }
    }
    return salutationLabels;
  }
}
