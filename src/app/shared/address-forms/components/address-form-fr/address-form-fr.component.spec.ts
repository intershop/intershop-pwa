import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AddressMockData } from 'ish-core/utils/dev/address-mock-data';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { SelectTitleComponent } from 'ish-shared/forms/components/select-title/select-title.component';

import { AddressFormFRComponent } from './address-form-fr.component';

describe('Address Form Fr Component', () => {
  let component: AddressFormFRComponent;
  let fixture: ComponentFixture<AddressFormFRComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressFormFRComponent, InputComponent, SelectTitleComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AddressFormFRComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const addressForm = AddressMockData.getAddressForm('FR');
        component.addressForm = addressForm;
        component.titles = ['Mrs.'];
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
    expect(element.querySelector('[data-testing-id=title]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=firstName]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=lastName]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=addressLine1]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=addressLine2]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=postalCode]')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=city]')).toBeTruthy();
  });
});
