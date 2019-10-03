import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { AddressMockData } from 'ish-core/utils/dev/address-mock-data';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { SelectRegionComponent } from 'ish-shared/forms/components/select-region/select-region.component';

import { AddressFormUSComponent } from './address-form-us.component';

describe('Address Form Us Component', () => {
  let component: AddressFormUSComponent;
  let fixture: ComponentFixture<AddressFormUSComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddressFormUSComponent,
        MockComponent(FaIconComponent),
        MockComponent(InputComponent),
        MockComponent(NgbPopover),
        MockComponent(SelectRegionComponent),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
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
      { countryCode: 'US', regionCode: 'AL', name: 'Alabama', id: 'USAL' },
      { countryCode: 'US', regionCode: 'FL', name: 'Florida', id: 'USFL' },
    ];
    fixture.detectChanges();
    expect(element.querySelector('[controlname=state]')).toBeFalsy();
  });

  it('should display an apo/fpo popover link on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('a[placement]')).toBeTruthy();
  });
});
