import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { RegionService } from '../../../core/services/countries/region.service';
import { CoreState } from '../../../core/store/core.state';
import { getAllCountries } from '../../../core/store/countries/countries.selectors';
import { CreateUser, getLoginError } from '../../../core/store/user';
import { Country } from '../../../models/country/country.model';
import { CustomerFactory } from '../../../models/customer/customer.factory';
import { Region } from '../../../models/region/region.model';

@Component({
  templateUrl: './registration-page.container.html'
})

export class RegistrationPageComponent implements OnInit {

  countries$: Observable<Country[]>;
  languages$: Observable<any[]>;
  regionsForSelectedCountry$: Observable<Region[]>;
  titlesForSelectedCountry$: Observable<Region[]>;
  userCreateError$: Observable<HttpErrorResponse>;

  constructor(
    private store: Store<CoreState>,
    private rs: RegionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.countries$ = this.store.pipe(select(getAllCountries));
    this.languages$ = this.getLanguages();
    this.userCreateError$ = this.store.pipe(select(getLoginError));
  }

  updateData(countryCode: string) {
    this.regionsForSelectedCountry$ = this.rs.getRegions(countryCode);
    this.titlesForSelectedCountry$ = this.getTitles(countryCode);
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  onCreate(value: any) {
    const customerData = CustomerFactory.fromFormValueToData(value);
    if (customerData.birthday === '') { customerData.birthday = null; }   // ToDo see IS-22276

    this.store.dispatch(new CreateUser(customerData));
  }

  // TODO: this is just a temporary workaround! these information must come from the store (or from a service)
  private getLanguages(): Observable<any[]> {
    return of([
      { localeid: 'en_US', name: 'English (United States)' },
      { localeid: 'fr_FR', name: 'French (France)' },
      { localeid: 'de_DE', name: 'German (Germany)' }
    ]);
  }

  private getTitles(countryCode: string): Observable<any[]> {
    let salutationlabels = [];

    switch (countryCode) {
      case 'DE': {
        salutationlabels = [
          'account.salutation.ms.text',
          'account.salutation.mr.text',
          'account.salutation.dr.text'
        ];
        break;
      }
      case 'FR': {
        salutationlabels = [
          'account.salutation.ms.text',
          'account.salutation.mr.text',
          'account.salutation.dr.text'
        ];
        break;
      }
      case 'GB': {
        salutationlabels = [
          'account.salutation.ms.text',
          'account.salutation.miss.text',
          'account.salutation.mrs.text',
          'account.salutation.mr.text',
          'account.salutation.dr.text'
        ];
        break;
      }
    }
    return of(salutationlabels);
  }
}
