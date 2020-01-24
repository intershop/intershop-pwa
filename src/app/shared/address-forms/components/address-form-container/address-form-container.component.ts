import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { Country } from 'ish-core/models/country/country.model';
import { Region } from 'ish-core/models/region/region.model';
import { AddressFormFactoryProvider } from 'ish-shared/address-forms/configurations/address-form-factory.provider';
import { determineSalutations, updateValidatorsByDataLength } from 'ish-shared/forms/utils/form-utils';

/**
 * The Address Form Container Component fetches address form related data (countries, regions, titles) and displays an address form using the {@link AddressFormComponent}
 *
 * @example
 * renders the address form for the input (parentForm) form.
 * <ish-address-form-container [parentForm]="form" ></ish-address-form-container>
 */
@Component({
  selector: 'ish-address-form-container',
  templateUrl: './address-form-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AddressFormContainerComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Parent form: it must contain control 'countryCodeSwitch' and the actual address control
   */
  @Input() parentForm: FormGroup;

  /**
   * control name of the address form control:  default name 'address'
   */
  @Input() controlName = 'address';

  countries$: Observable<Country[]>;
  loading$: Observable<boolean>;
  regions$: Observable<Region[]>;
  titles: string[];
  isBusinessCustomer = false;

  private destroy$ = new Subject();

  constructor(
    private accountFacade: AccountFacade,
    private appFacade: AppFacade,
    private afs: AddressFormFactoryProvider,
    private cd: ChangeDetectorRef,
    private featureToggle: FeatureToggleService
  ) {}

  ngOnInit() {
    this.countries$ = this.appFacade.countries$();
    this.loading$ = this.appFacade.countriesLoading$;
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.parentForm) {
      this.accountFacade.isBusinessCustomer$
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          data => (this.isBusinessCustomer = data || this.featureToggle.enabled('businessCustomerRegistration'))
        );

      const group = this.afs.getFactory('default').getGroup({ isBusinessAddress: this.isBusinessCustomer });
      this.parentForm.setControl(this.controlName, group);

      this.parentForm
        .get('countryCodeSwitch')
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(countryCodeSwitch => this.handleCountryChange(countryCodeSwitch));
    }
  }

  /**
   * Changes address form after country has been changed.
   * Gets country specific data like regions and salutations
   * @param countryCode country code of the country that has been selected in the address form
   */
  private handleCountryChange(countryCode: string) {
    const oldFormValue = this.parentForm.get(this.controlName).value;
    const group = this.afs.getFactory(countryCode).getGroup({
      isBusinessAddress: this.isBusinessCustomer,
      value: {
        ...oldFormValue,
        countryCode,
      },
    });
    this.parentForm.setControl(this.controlName, group);

    this.fetchDataAfterCountryChange(countryCode);
  }

  /**
   * fetches titles and regions after country change and updates address form validator for regions
   */
  private fetchDataAfterCountryChange(countryCode: string) {
    if (countryCode) {
      this.regions$ = this.appFacade.regions$(countryCode).pipe(tap(regions => this.updateRegions(regions)));

      this.titles = determineSalutations(countryCode);
      this.cd.detectChanges(); // necessary to show titles/regions while editing an existing address
    }
  }

  /**
   * update validators for "state (mainDivision)" control in address form according to regions
   */
  private updateRegions(regions: Region[]) {
    const addressForm = this.parentForm.get(this.controlName);

    if (addressForm) {
      const stateControl = addressForm.get('mainDivisionCode');
      if (regions && regions.length && stateControl) {
        updateValidatorsByDataLength(stateControl, regions, Validators.required, false);

        const selectedRegionExists = regions.find(region => region.regionCode === stateControl.value);

        // clear old value if region doesn't exist in new list
        if (!selectedRegionExists) {
          stateControl.setValue('');
        }
      }
    }
  }

  get countryCode() {
    return this.parentForm && this.parentForm.get('countryCodeSwitch')
      ? this.parentForm.get('countryCodeSwitch').value
      : undefined;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
