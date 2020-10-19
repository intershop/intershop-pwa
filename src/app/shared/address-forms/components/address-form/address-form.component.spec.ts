import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { AddressFormBusinessComponent } from 'ish-shared/address-forms/components/address-form-business/address-form-business.component';
import { AddressFormDEComponent } from 'ish-shared/address-forms/components/address-form-de/address-form-de.component';
import { AddressFormDefaultComponent } from 'ish-shared/address-forms/components/address-form-default/address-form-default.component';
import { AddressFormFRComponent } from 'ish-shared/address-forms/components/address-form-fr/address-form-fr.component';
import { AddressFormGBComponent } from 'ish-shared/address-forms/components/address-form-gb/address-form-gb.component';
import { AddressFormUSComponent } from 'ish-shared/address-forms/components/address-form-us/address-form-us.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { SelectCountryComponent } from 'ish-shared/forms/components/select-country/select-country.component';

import { AddressFormComponent } from './address-form.component';

describe('Address Form Component', () => {
  let component: AddressFormComponent;
  let fixture: ComponentFixture<AddressFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddressFormComponent,
        MockComponent(AddressFormBusinessComponent),
        MockComponent(AddressFormDEComponent),
        MockComponent(AddressFormDefaultComponent),
        MockComponent(AddressFormFRComponent),
        MockComponent(AddressFormGBComponent),
        MockComponent(AddressFormUSComponent),
        MockComponent(InputComponent),
        MockComponent(SelectCountryComponent),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const form = new FormGroup({
      countryCodeSwitch: new FormControl(),
      phoneHome: new FormControl(),
    });

    component.parentForm = form;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter parentForm is missing', () => {
    component.parentForm = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it("should set the default value 'address' if input parameter controlName is missing", () => {
    expect(component.controlName).toEqual('address');
  });

  it('should be rendered on creation and show countrySwitch and phoneHome', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-select-country[controlName=countryCodeSwitch]')).toBeTruthy();
    expect(element.querySelector('ish-input[controlName=phoneHome]')).toBeTruthy();
  });

  describe('dataprovider', () => {
    it.each([
      ['ish-address-form-default', ''],
      ['ish-address-form-de', 'DE'],
      ['ish-address-form-fr', 'FR'],
      ['ish-address-form-gb', 'GB'],
      ['ish-address-form-us', 'US'],
      ['ish-address-form-default', 'BG'],
    ])(`should render '%s' if countryCode equals '%s'`, (cmp, countryCode) => {
      component.countryCode = countryCode;
      fixture.detectChanges();
      expect(findAllCustomElements(element)).toContain(cmp);
    });
  });
});
