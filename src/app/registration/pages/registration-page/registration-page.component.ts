import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { USER_REGISTRATION_SUBSCRIBE_TO_NEWSLETTER } from '../../../core/configurations/injection-keys';
import { FormUtilsService } from '../../../core/services/utils/form-utils.service';
import { Country } from '../../../models/country/country.model';
import { CustomerFactory } from '../../../models/customer/customer.factory';
import { Region } from '../../../models/region/region.model';
import { CountryService } from '../../../shared/services/countries/country.service';
import { RegionService } from '../../../shared/services/countries/region.service';
import { CustomerRegistrationService } from '../../services/customer-registration.service';

@Component({
  templateUrl: './registration-page.component.html'
})

export class RegistrationPageComponent implements OnInit {

  countries$: Observable<Country[]>;
  languages$: Observable<any[]>;
  regionsForSelectedCountry$: Observable<Region[]>;

  constructor(
    @Inject(USER_REGISTRATION_SUBSCRIBE_TO_NEWSLETTER) public emailOptIn: boolean,
    private router: Router,
    private cs: CountryService,
    private rs: RegionService,
    private customerService: CustomerRegistrationService
  ) { }

  ngOnInit() {
    this.countries$ = this.cs.getCountries();
    this.languages$ = this.getLanguages();
  }

  updateRegions(countryCode: string) {
    this.regionsForSelectedCountry$ = this.rs.getRegions(countryCode);
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  onCreate(value: any) {
    const customerData = CustomerFactory.fromFormValueToData(value);
    if (customerData.birthday === '') { customerData.birthday = null; }   // ToDo see IS-22276
    this.customerService.registerPrivateCustomer(customerData).subscribe(response => {

      if (response) {
        this.router.navigate(['/home']);
      }
    });
  }

  // TODO: this is just a temporary workaround! these information must come from the store (or from a service)
  getLanguages(): Observable<any[]> {
    return Observable.of([
      { localeid: 'en_US', name: 'English (United States)' },
      { localeid: 'fr_FR', name: 'French (France)' },
      { localeid: 'de_DE', name: 'German (Germany)' }
    ]);
  }
}





