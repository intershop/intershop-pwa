import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { AVAILABLE_LOCALES } from '../../../core/configurations/injection-keys';
import { RegionService } from '../../../core/services/countries/region.service';
import { getAllCountries } from '../../../core/store/countries/countries.selectors';
import { CreateUser, getUserError } from '../../../core/store/user';
import { determineSalutations } from '../../../forms/shared/utils/form-utils';
import { Customer } from '../../../models/customer/customer.model';
import { Locale } from '../../../models/locale/locale.model';
import { Region } from '../../../models/region/region.model';

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
