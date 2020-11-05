import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';

import { AddressMockData } from 'ish-core/utils/dev/address-mock-data';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { SelectRegionComponent } from 'ish-shared/forms/components/select-region/select-region.component';

import { AddressFormDefaultComponent } from './address-form-default.component';

describe('Address Form Default Component', () => {
  let component: AddressFormDefaultComponent;
  let fixture: ComponentFixture<AddressFormDefaultComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressFormDefaultComponent, MockComponent(InputComponent), MockComponent(SelectRegionComponent)],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFormDefaultComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const addressForm = AddressMockData.getAddressForm('BG');
    component.addressForm = addressForm;
  });

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
    expect(element.querySelector('[controlname=firstName]')).toBeTruthy();
    expect(element.querySelector('[controlname=lastName]')).toBeTruthy();
    expect(element.querySelector('[controlname=addressLine1]')).toBeTruthy();
    expect(element.querySelector('[controlname=addressLine2]')).toBeTruthy();
    expect(element.querySelector('[controlname=postalCode]')).toBeTruthy();
    expect(element.querySelector('[controlname=city]')).toBeTruthy();
  });

  it('should display region select box if regions  input parameter is not empty', () => {
    fixture.detectChanges();
    expect(element.querySelector('[controlname=state]')).toBeFalsy();

    component.regions = [
      { countryCode: 'BG', regionCode: '02', name: 'Burgas', id: 'BG02' },
      { countryCode: 'BG', regionCode: '23', name: 'Sofia', id: 'BG23' },
    ];
    fixture.detectChanges();
    expect(element.querySelector('[controlname=state]')).toBeFalsy();
  });
});
