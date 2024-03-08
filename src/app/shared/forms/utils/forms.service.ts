import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, OperatorFunction, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { getCurrentLocale } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * FormsService.getAddressOptions as a pipeable operator
 *
 * @returns the input addresses, mapped to select options
 */
export function mapToAddressOptions(): OperatorFunction<Address[], SelectOption[]> {
  return (source$: Observable<Address[]>) => FormsService.getAddressOptions(source$);
}

@Injectable({ providedIn: 'root' })
export class FormsService {
  constructor(private translate: TranslateService, private store: Store) {}

  /**
   * Get address select options for addresses in order to render them in an address select box.
   *
   * @param addresses
   * @returns address select options observable
   */
  static getAddressOptions(addresses$: Observable<Address[]>): Observable<SelectOption[]> {
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
   * Gets budget period select options for cost center budgets.
   */
  static getCostCenterBudgetPeriodOptions() {
    const periods = ['fixed', 'weekly', 'monthly', 'quarterly', 'half-yearly', 'yearly'];

    return periods.map(period => ({
      value: period,
      // keep-localization-pattern: ^account\.costcenter\.budget\.period\.value.*
      label: `account.costcenter.budget.period.value.${period}`,
    }));
  }

  /**
   * Gets all possible salutation options for a certain country.
   *
   * @param countryCode country code of the country for which the salutations should be determined.
   * @returns salutation select options
   */
  getSalutationOptionsForCountryCode(countryCode: string): Observable<SelectOption[]> {
    return forkJoin<SelectOption[]>(
      this.determineSalutations(countryCode).map(title =>
        this.translate.get(title).pipe(map(translation => ({ value: translation, label: title })))
      )
    );
  }

  /**
   * Gets all possible salutation options for the current locale.
   *
   * @returns salutation select options
   */
  getSalutationOptions(): Observable<SelectOption[]> {
    return this.store.pipe(select(getCurrentLocale)).pipe(
      whenTruthy(),
      switchMap(locale => this.getSalutationOptionsForCountryCode(locale?.substring(3)))
    );
  }

  /**
   * Gets all possible salutations for a certain country.
   *
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
