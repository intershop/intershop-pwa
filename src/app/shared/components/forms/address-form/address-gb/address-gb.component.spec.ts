import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito';
import { InputComponent } from '../../../form-controls/input/input.component';
import { SelectTitleComponent } from '../../../form-controls/select-title/select-title.component';
import { AddressGBComponent } from './address-gb.component';

describe('British Address Component', () => {
  let component: AddressGBComponent;
  let fixture: ComponentFixture<AddressGBComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const translateServiceMock = mock(TranslateService);
    when(translateServiceMock.get(anything())).thenCall((data) => {
      if (data === 'labelKey') {
        return Observable.of('LabelName');
      } else {
        return Observable.of(null);
      }
    });
    TestBed.configureTestingModule({
      declarations: [AddressGBComponent, InputComponent, SelectTitleComponent],
      providers: [
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) },
      ],
      imports: [
        TranslateModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(AddressGBComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const addressForm = new FormGroup({
          countryCode: new FormControl('GB'),
          firstName: new FormControl(''),
          lastName: new FormControl(''),
          addressLine1: new FormControl(''),
          addressLine2: new FormControl(''),
          postalCode: new FormControl(''),
          city: new FormControl('')
        });
        component.addressForm = addressForm;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should throw an error if input parameter addressForm is not set', () => {
    component.addressForm = null;
    expect(function() { fixture.detectChanges(); }).toThrow();
  });

  it('should create special form parameters on creation', () => {
    expect(component.addressForm.get('title')).toBeNull('title control does not exist before onInit');
    expect(component.addressForm.get('addressLine3')).toBeNull('addressLine3 control does not exist before onInit');
    fixture.detectChanges();
    expect(component.addressForm.get('title').value).toEqual('', 'title control exists after onInit');
    expect(component.addressForm.get('addressLine3').value).toEqual('', 'addressLine3 control exists after onInit');
  });

  it('should set special validators on creation', () => {
    expect(component.addressForm.get('postalCode').validator).toBeNull('postalCode control has no validator before onInit');
    fixture.detectChanges();
    expect(component.addressForm.get('postalCode').validator).toBeTruthy('postalCode control has a validator after onInit');
  });

  it('should display form input fields on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('select[data-testing-id=title]')).toBeTruthy('title is rendered');
    expect(element.querySelector('input[data-testing-id=firstName]')).toBeTruthy('first name is rendered');
    expect(element.querySelector('input[data-testing-id=lastName]')).toBeTruthy('last name is rendered');
    expect(element.querySelector('input[data-testing-id=addressLine1]')).toBeTruthy('addressLine1 is rendered');
    expect(element.querySelector('input[data-testing-id=addressLine2]')).toBeTruthy('addressLine2 is rendered');
    expect(element.querySelector('input[data-testing-id=addressLine3]')).toBeTruthy('addressLine3 is rendered');
    expect(element.querySelector('input[data-testing-id=postalCode]')).toBeTruthy('postalCode is rendered');
    expect(element.querySelector('input[data-testing-id=city]')).toBeTruthy('city is rendered');
  });
});
