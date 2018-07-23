import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent } from '../../../shared/components/form-controls/input/input.component';
import { SelectTitleComponent } from '../../../shared/components/form-controls/select/select-title/select-title.component';
import { AddressFormGBComponent } from './address-form-gb.component';

describe('Address Form Gb Component', () => {
  let component: AddressFormGBComponent;
  let fixture: ComponentFixture<AddressFormGBComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressFormGBComponent, InputComponent, SelectTitleComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AddressFormGBComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const addressForm = new FormGroup({
          countryCode: new FormControl('GB'),
          title: new FormControl(''),
          firstName: new FormControl(''),
          lastName: new FormControl(''),
          addressLine1: new FormControl(''),
          addressLine2: new FormControl(''),
          addressLine3: new FormControl(''),
          postalCode: new FormControl(''),
          city: new FormControl(''),
        });
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
    expect(element.querySelector('select[data-testing-id=title]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=firstName]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=lastName]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=addressLine1]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=addressLine2]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=addressLine3]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=postalCode]')).toBeTruthy();
    expect(element.querySelector('input[data-testing-id=city]')).toBeTruthy();
  });
});
