import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';

/**
 * Marks all fields in a form group as dirty recursively (i.e. for nested form groups also)
 * @param formGroup The form group
 */
export function markAsDirtyRecursive(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(key => {
    if (formGroup.controls[key] instanceof FormGroup) {
      markAsDirtyRecursive(formGroup.controls[key] as FormGroup);
    } else {
      formGroup.controls[key].markAsDirty();
      formGroup.controls[key].updateValueAndValidity();
    }
  });
}

/**
 * Gets all possible salutations for a certain country.
 * @param countryCode country code of the country for which the salutations should be determined.
 * @returns translation keys of the salutations
 */
export function determineSalutations(countryCode: string): string[] {
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
      salutationLabels = [
        'account.salutation.ms.text',
        'account.salutation.miss.text',
        'account.salutation.mrs.text',
        'account.salutation.mr.text',
        'account.salutation.dr.text',
      ];
      break;
    }
  }
  return salutationLabels;
}

/**
 * Get address select options for addresses in order to render them in an address select box.
 * @param addresses
 * @returns address select options
 */
export function getAddressOptions(addresses$: Observable<Address[]>): Observable<SelectOption[]> {
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
