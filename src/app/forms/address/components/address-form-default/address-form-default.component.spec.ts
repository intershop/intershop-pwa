import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputComponent } from '../../../shared/components/form-controls/input/input.component';
import { SelectTitleComponent } from '../../../shared/components/form-controls/select/select-title/select-title.component';
import { AddressFormDefaultComponent } from './address-form-default.component';

describe('German Address Component', () => {
  let component: AddressFormDefaultComponent;
  let fixture: ComponentFixture<AddressFormDefaultComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
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
    })
  );

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
    expect(element.querySelector('input[data-testing-id=firstName]')).toBeTruthy('first name is rendered');
    expect(element.querySelector('input[data-testing-id=lastName]')).toBeTruthy('last name is rendered');
    expect(element.querySelector('input[data-testing-id=addressLine1]')).toBeTruthy('addressLine1 is rendered');
    expect(element.querySelector('input[data-testing-id=addressLine2]')).toBeTruthy('addressLine2 is rendered');
    expect(element.querySelector('input[data-testing-id=postalCode]')).toBeTruthy('postalCode is rendered');
    expect(element.querySelector('input[data-testing-id=city]')).toBeTruthy('city is rendered');
  });

  it('should display region select box if regions  input parameter is not empty', () => {
    fixture.detectChanges();
    expect(element.querySelector('select[data-testing-id=state]')).toBeFalsy('state select is not rendered');

    component.regions = [
      { countryCode: 'BG', regionCode: '02', name: 'Burgas' },
      { countryCode: 'BG', regionCode: '23', name: 'Sofia' },
    ];
    fixture.detectChanges();
    expect(element.querySelector('select[data-testing-id=state]')).toBeFalsy('state select is rendered');
  });
});
