import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import * as using from 'jasmine-data-provider';
import { AddressFormComponent } from './address-form.component';

describe('Select Component', () => {
  let component: AddressFormComponent;
  let fixture: ComponentFixture<AddressFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressFormComponent],
      imports: [
        TranslateModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AddressFormComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;

      const form = new FormGroup({
        countryCodeSwitch: new FormControl(),
        phoneHome: new FormControl(),
      });

      component.parentForm = form;
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter parentForm is missing', () => {
    component.parentForm = null;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should set the default value \'address\' if input parameter controlName is missing', () => {
    expect(component.controlName).toEqual('address');
  });

  it('should be rendered on creation and show countrySwitch and phoneHome', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-select-country[controlName=countryCodeSwitch]')).toBeTruthy('country select is rendered');
    expect(element.querySelector('ish-input[controlName=phoneHome]')).toBeTruthy('phone home input is rendered');
  });

  describe('dataprovider', () => {
    function dataProvider() {
      return [
        { countryCode: '', cmp: 'ish-address-form-default' },
        { countryCode: 'DE', cmp: 'ish-address-form-de' },
        { countryCode: 'FR', cmp: 'ish-address-form-fr' },
        { countryCode: 'GB', cmp: 'ish-address-form-gb' },
        { countryCode: 'US', cmp: 'ish-address-form-us' },
        { countryCode: 'BG', cmp: 'ish-address-form-default' },
      ];
    }

    using(dataProvider, (dataSlice) => {
      it(`should render \'${dataSlice.cmp}\' if countryCode equals \'${dataSlice.countryCode}\'`, () => {
        component.countryCode = (dataSlice.countryCode);
        fixture.detectChanges();
        expect(element.querySelector(dataSlice.cmp)).toBeTruthy('country specific address form is rendered');
      });
    });
  });
});
