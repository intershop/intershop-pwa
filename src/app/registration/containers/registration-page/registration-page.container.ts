import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { Region } from 'ish-core/models/region/region.model';
import { RegionService } from 'ish-core/services/countries/region.service';
import { getAllCountries } from 'ish-core/store/countries/countries.selectors';
import { CreateUser, getUserError } from 'ish-core/store/user';
import { determineSalutations } from '../../../forms/shared/utils/form-utils';

/**
 * The Registration Page Container renders the customer registration form using the {@link RegistrationFormComponent}
 *
 */
@Component({
  templateUrl: './registration-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageContainerComponent {
  countries$ = this.store.pipe(select(getAllCountries));
  userCreateError$ = this.store.pipe(select(getUserError));
  regionsForSelectedCountry: Region[];
  titlesForSelectedCountry: string[];

  constructor(
    private store: Store<{}>,
    private rs: RegionService,
    private router: Router,
    @Inject(AVAILABLE_LOCALES) public locales: Locale[]
  ) {}

  updateData(countryCode: string) {
    this.regionsForSelectedCountry = this.rs.getRegions(countryCode);
    this.titlesForSelectedCountry = determineSalutations(countryCode);
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  onCreate(customer: Customer) {
    this.store.dispatch(new CreateUser(customer));
  }
}
