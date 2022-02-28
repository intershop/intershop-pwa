import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Country } from 'ish-core/models/country/country.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { StoreLocatorFacade } from '../../facades/store-locator.facade';
import { StoreLocationHelper } from '../../models/store-location/store-location.helper';
import { StoreLocation } from '../../models/store-location/store-location.model';
import { StoresMapComponent } from '../../shared/stores-map/stores-map.component';

@Component({
  selector: 'ish-store-locator-page',
  templateUrl: './store-locator-page.component.html',
  styleUrls: ['./store-locator-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreLocatorPageComponent implements OnInit {
  @ViewChild('map') map: StoresMapComponent;

  loading$: Observable<boolean>;
  error$: Observable<HttpError>;
  stores$: Observable<StoreLocation[]>;
  highlightedStore$: Observable<StoreLocation>;

  submitted = false;

  form = new FormGroup({});
  model = { countryCode: '', postalCode: '', city: '' };
  fields: FormlyFieldConfig[];

  constructor(private storeLocatorFacade: StoreLocatorFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    this.fields = this.getFields();
    this.loading$ = this.storeLocatorFacade.getLoading$();
    this.stores$ = this.storeLocatorFacade.getStores$();
    this.highlightedStore$ = this.storeLocatorFacade.getHighlighted$();
    this.error$ = this.storeLocatorFacade.getError$();
  }
  private getFields() {
    return [
      {
        key: 'countryCode',
        type: 'ish-select-field',
        wrappers: ['form-field-horizontal'],
        templateOptions: {
          required: false,
          label: 'store_locator.form.country.label',
          placeholder: 'store_locator.form.country.default',
          options: this.appFacade
            .countries$()
            .pipe(
              map((countries: Country[]) =>
                countries.map(country => ({ value: country.countryCode, label: country.name }))
              )
            ),
        },
      },
      {
        key: 'postalCode',
        type: 'ish-text-input-field',
        templateOptions: {
          type: 'text',
          label: 'store_locator.form.postalCode.label',
        },
      },
      {
        key: 'city',
        type: 'ish-text-input-field',
        templateOptions: {
          type: 'text',
          label: 'store_locator.form.city.label',
        },
      },
    ];
  }

  submitForm() {
    const countryCode = this.model.countryCode;
    const postalCode = this.model.postalCode;
    const city = this.model.city;

    this.submitted = true;

    this.storeLocatorFacade.loadStores(countryCode, postalCode, city);
  }

  empty(stores: StoreLocation[]) {
    return !stores?.length;
  }

  highlighted$(store: StoreLocation) {
    return this.highlightedStore$.pipe(map(highlightedStore => StoreLocationHelper.equal(store, highlightedStore)));
  }

  highlight(store: StoreLocation) {
    this.storeLocatorFacade.setHighlighted(store);
  }
}
