import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { USER_REGISTRATION_SUBSCRIBE_TO_NEWSLETTER } from '../../../core/configurations/injection-keys';
import { CountryService } from '../../../core/services/countries/country.service';
import { RegionService } from '../../../core/services/countries/region.service';
import { CreateUser, getLoginError, Go, State } from '../../../core/store';
import { Country } from '../../../models/country/country.model';
import { CustomerFactory } from '../../../models/customer/customer.factory';
import { Region } from '../../../models/region/region.model';

@Component({
  templateUrl: './registration-page.component.html'
})

export class RegistrationPageComponent implements OnInit {

  countries$: Observable<Country[]>;
  languages$: Observable<any[]>;
  regionsForSelectedCountry$: Observable<Region[]>;
  userCreateError$: Observable<HttpErrorResponse>;

  constructor(
    @Inject(USER_REGISTRATION_SUBSCRIBE_TO_NEWSLETTER) public emailOptIn: boolean,
    private store: Store<State>,
    private cs: CountryService,
    private rs: RegionService,
  ) { }

  ngOnInit() {
    this.countries$ = this.cs.getCountries();
    this.languages$ = this.getLanguages();
    this.userCreateError$ = this.store.select(getLoginError);
  }

  updateRegions(countryCode: string) {
    this.regionsForSelectedCountry$ = this.rs.getRegions(countryCode);
  }

  onCancel() {
    this.store.dispatch(new Go({ path: ['/home'] }));
  }

  onCreate(value: any) {
    console.log('before', value);
    const customerData = CustomerFactory.fromFormValueToData(value);
    console.log('after', customerData);
    if (customerData.birthday === '') { customerData.birthday = null; }   // ToDo see IS-22276

    this.store.dispatch(new CreateUser(customerData));
  }

  // TODO: this is just a temporary workaround! these information must come from the store (or from a service)
  getLanguages(): Observable<any[]> {
    return of([
      { localeid: 'en_US', name: 'English (United States)' },
      { localeid: 'fr_FR', name: 'French (France)' },
      { localeid: 'de_DE', name: 'German (Germany)' }
    ]);
  }
}





