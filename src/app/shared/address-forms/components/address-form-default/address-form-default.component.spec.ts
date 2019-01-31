import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AddressMockData } from 'ish-core/utils/dev/address-mock-data';
import { InputComponent } from '../../../forms/components/input/input.component';
import { SelectTitleComponent } from '../../../forms/components/select-title/select-title.component';

import { AddressFormDefaultComponent } from './address-form-default.component';

describe('Address Form Default Component', () => {
  let component: AddressFormDefaultComponent;
  let fixture: ComponentFixture<AddressFormDefaultComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressFormDefaultComponent, InputComponent, SelectTitleComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AddressFormDefaultComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const addressForm = AddressMockData.getAddressForm('BG');
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
      { countryCode: 'BG', regionCode: '02', name: 'Burgas', id: 'BG02' },
      { countryCode: 'BG', regionCode: '23', name: 'Sofia', id: 'BG23' },
    ];
    fixture.detectChanges();
    expect(element.querySelector('select[data-testing-id=state]')).toBeFalsy();
  });
});
