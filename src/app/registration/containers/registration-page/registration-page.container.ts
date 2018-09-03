import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { AVAILABLE_LOCALES } from '../../../core/configurations/injection-keys';
import { RegionService } from '../../../core/services/countries/region.service';
import { getAllCountries } from '../../../core/store/countries/countries.selectors';
import { CreateUser, getUserError } from '../../../core/store/user';
import { Country } from '../../../models/country/country.model';
import { Customer } from '../../../models/customer/customer.model';
import { HttpError } from '../../../models/http-error/http-error.model';
import { Locale } from '../../../models/locale/locale.model';
import { Region } from '../../../models/region/region.model';

@Component({
  templateUrl: './registration-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageContainerComponent implements OnInit {
  countries$: Observable<Country[]>;
  languages$: Observable<Locale[]>;
  regionsForSelectedCountry$: Observable<Region[]>;
  titlesForSelectedCountry$: Observable<string[]>;
  userCreateError$: Observable<HttpError>;

  constructor(
    private store: Store<{}>,
    private rs: RegionService,
    private router: Router,
    @Inject(AVAILABLE_LOCALES) locales: Locale[]
  ) {
    this.languages$ = of(locales);
  }

  ngOnInit() {
    this.countries$ = this.store.pipe(select(getAllCountries));
    this.userCreateError$ = this.store.pipe(select(getUserError));
  }

  updateData(countryCode: string) {
    this.regionsForSelectedCountry$ = this.rs.getRegions(countryCode);
    this.titlesForSelectedCountry$ = this.getTitles(countryCode);
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  onCreate(customer: Customer) {
    this.store.dispatch(new CreateUser(customer));
  }

  // TODO: should come from configuration?
  private getTitles(countryCode: string): Observable<string[]> {
    let salutationlabels = [];

    switch (countryCode) {
      case 'DE': {
        salutationlabels = ['account.salutation.ms.text', 'account.salutation.mr.text', 'account.salutation.dr.text'];
        break;
      }
      case 'FR': {
        salutationlabels = ['account.salutation.ms.text', 'account.salutation.mr.text', 'account.salutation.dr.text'];
        break;
      }
      case 'GB': {
        salutationlabels = [
          'account.salutation.ms.text',
          'account.salutation.miss.text',
          'account.salutation.mrs.text',
          'account.salutation.mr.text',
          'account.salutation.dr.text',
        ];
        break;
      }
    }
    return of(salutationlabels);
  }
}
