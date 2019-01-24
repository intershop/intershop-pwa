import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AddressMockData } from 'ish-core/utils/dev/address-mock-data';
import { InputComponent } from '../../../forms/components/input/input.component';
import { SelectTitleComponent } from '../../../forms/components/select-title/select-title.component';

import { AddressFormUSComponent } from './address-form-us.component';

describe('Address Form Us Component', () => {
  let component: AddressFormUSComponent;
  let fixture: ComponentFixture<AddressFormUSComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressFormUSComponent, InputComponent, SelectTitleComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AddressFormUSComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const addressForm = AddressMockData.getAddressForm('US');
        component.addressForm = addressForm;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter addressForm is not set', () => {
    component.addressForm = undefined;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should display form input fields on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('input[data-testing-id=firstName]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=lastName]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=addressLine1]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=addressLine2]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=postalCode]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=city]')).toBeTruthy();
  });

  it('should display region select box if regions  input parameter is not empty', () => {
    fixture.detectChanges();
    expect(element.querySelector('select[data-testing-id=state]')).toBeFalsy();

    component.regions = [
      { countryCode: 'US', regionCode: 'AL', name: 'Alabama' },
      { countryCode: 'US', regionCode: 'FL', name: 'Florida' },
    ];
    fixture.detectChanges();
    expect(element.querySelector('select[data-testing-id=state]')).toBeFalsy();
  });

  it('should display an apo/fpo popover link on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('a[placement]')).toBeTruthy();
  });
});
