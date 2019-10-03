import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

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
      declarations: [AddressFormFRComponent, MockComponent(InputComponent), MockComponent(SelectTitleComponent)],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
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
    expect(element.querySelector('[controlname=title]')).toBeTruthy();
    expect(element.querySelector('[controlname=firstName]')).toBeTruthy();
    expect(element.querySelector('[controlname=lastName]')).toBeTruthy();
    expect(element.querySelector('[controlname=addressLine1]')).toBeTruthy();
    expect(element.querySelector('[controlname=addressLine2]')).toBeTruthy();
    expect(element.querySelector('[controlname=postalCode]')).toBeTruthy();
    expect(element.querySelector('[controlname=city]')).toBeTruthy();
  });
});
