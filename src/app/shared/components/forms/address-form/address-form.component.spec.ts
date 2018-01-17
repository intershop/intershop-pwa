import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import * as using from 'jasmine-data-provider';
import { AddressFormComponent } from './address-form.component';

describe('Address Form Component', () => {
  let component: AddressFormComponent;
  let fixture: ComponentFixture<AddressFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressFormComponent],

      providers: [
        FormBuilder
      ],
      imports: [
        TranslateModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(AddressFormComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const parentForm = new FormGroup({
        });
        component.parentForm = parentForm;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should throw an error if input parameter parentForm is not set', () => {
    component.parentForm = null;
    expect(function() { fixture.detectChanges(); }).toThrow();
  });

  it('should create an address form on creation', () => {
    expect(component.addressForm).toBeUndefined('address form has not been created before init');
    fixture.detectChanges();
    expect(component.addressForm.get('countryCode')).toBeTruthy('address form contains a country code control');
    expect(component.addressForm.get('firstName')).toBeTruthy('address form contains a firstName control');
    expect(component.addressForm.get('lastName')).toBeTruthy('address form contains a lastName control');
    expect(component.addressForm.get('addressLine1')).toBeTruthy('address form contains a addressLine1 control');
    expect(component.addressForm.get('addressLine2')).toBeTruthy('address form contains a addressLine2 control');
    expect(component.addressForm.get('postalCode')).toBeTruthy('address form contains a postalCode control');
    expect(component.addressForm.get('city')).toBeTruthy('address form contains a city control');
    expect(component.addressForm.get('phoneHome')).toBeTruthy('address form contains a phoneHome control');
  });

  describe('dataprovider', () => {
    function dataProvider() {
      return [
        { countryCode: '', cmp: 'ish-address-default' },
        { countryCode: 'DE', cmp: 'ish-address-de' },
        { countryCode: 'FR', cmp: 'ish-address-fr' },
        { countryCode: 'GB', cmp: 'ish-address-gb' },
        { countryCode: 'US', cmp: 'ish-address-us' },
        { countryCode: 'BG', cmp: 'ish-address-default' },
      ];
    }

    using(dataProvider, (dataSlice) => {
      it(`should render \'${dataSlice.cmp}\' if countryCode equals \'${dataSlice.countryCode}\'`, () => {
        expect(component.addressForm).toBeUndefined('address form has not been created before detectChanges');
        fixture.detectChanges();
        expect(component.addressForm).toBeTruthy('address form has been created');
        component.addressForm.get('countryCode').setValue(dataSlice.countryCode);
        fixture.detectChanges();
        expect(element.querySelector(dataSlice.cmp)).toBeTruthy('country specific address form is rendered');
      });
    });
  });
});
