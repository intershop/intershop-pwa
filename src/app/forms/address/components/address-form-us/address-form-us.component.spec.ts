import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent } from '../../../shared/components/form-controls/input/input.component';
import { SelectTitleComponent } from '../../../shared/components/form-controls/select/select-title/select-title.component';
import { AddressFormUSComponent } from './address-form-us.component';

describe('German Address Component', () => {
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

        const addressForm = new FormGroup({
          countryCode: new FormControl('BG'),
          firstName: new FormControl(''),
          lastName: new FormControl(''),
          addressLine1: new FormControl(''),
          addressLine2: new FormControl(''),
          postalCode: new FormControl(''),
          city: new FormControl(''),
        });
        component.addressForm = addressForm;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter addressForm is not set', () => {
    component.addressForm = null;
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
