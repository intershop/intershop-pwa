import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { anything, instance, mock, when } from 'ts-mockito';

import { AddressFormFactory } from '../../../forms/address/components/address-form/address-form.factory';
import { AddressFormFactoryProvider } from '../../../forms/address/configurations/address-form-factory.provider';
import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { HttpError, HttpHeader } from '../../../models/http-error/http-error.model';
import { MockComponent } from '../../../utils/dev/mock.component';

import { RegistrationFormComponent } from './registration-form.component';

describe('Registration Form Component', () => {
  let fixture: ComponentFixture<RegistrationFormComponent>;
  let component: RegistrationFormComponent;
  let element: HTMLElement;
  let fb: FormBuilder;

  beforeEach(async(() => {
    const addressFormFactoryMock = mock(AddressFormFactory);
    when(addressFormFactoryMock.getGroup(anything())).thenReturn(new FormGroup({}));

    const addressFormFactoryProviderMock = mock(AddressFormFactoryProvider);
    when(addressFormFactoryProviderMock.getFactory(anything())).thenReturn(addressFormFactoryMock);

    TestBed.configureTestingModule({
      declarations: [
        RegistrationFormComponent,
        MockComponent({
          selector: 'ish-registration-credentials-form',
          template: 'Credentials Template',
          inputs: ['parentForm', 'controlName'],
        }),
        MockComponent({
          selector: 'ish-address-form',
          template: 'Address Template',
          inputs: ['parentForm', 'controlName', 'countryCode', 'regions', 'countries', 'titles'],
        }),
      ],
      providers: [{ provide: AddressFormFactoryProvider, useFactory: () => instance(addressFormFactoryProviderMock) }],
      imports: [FormsSharedModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.get(FormBuilder);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should create a registration form on creation', () => {
    expect(component.form).toBeUndefined();
    fixture.detectChanges();
    expect(component.form.get('preferredLanguage')).toBeTruthy();
    expect(component.form.get('birthday')).toBeTruthy();
  });

  it('should throw cancel event when cancel is clicked', done => {
    component.cancel.subscribe(() => {
      done();
    });

    component.cancelForm();
  });

  it('should set submitted flag if submit is clicked and form is not valid', async(() => {
    component.form = new FormGroup({
      preferredLanguage: new FormControl('', Validators.required),
    });
    expect(component.submitted).toBeFalsy();
    component.submitForm();
    fixture.whenStable().then(() => {
      expect(component.submitted).toBeTruthy();
    });
  }));

  it('should NOT throw create event for invalid form', done => {
    component.form = new FormGroup({
      control: new FormControl('', Validators.required),
    });

    component.create.subscribe(() => {
      fail();
      done();
    });

    component.submitForm();
    fixture.detectChanges();

    done();
  });

  it('should throw create event for valid form (and not when invalid)', done => {
    component.form = fb.group({
      control: new FormControl('foo', Validators.required),
      credentials: fb.group({}),
      address: fb.group({}),
    });

    component.create.subscribe(() => {
      done();
    });

    component.submitForm();
    fixture.detectChanges();
  });

  it('should display error when supplied', () => {
    const error = {
      headers: { 'error-key': 'customer.credentials.login.not_unique.error' } as HttpHeader,
    } as HttpError;

    component.error = error;
    component.ngOnChanges({ error: new SimpleChange(undefined, component.error, false) });
    fixture.detectChanges();

    expect(element.querySelector('div.alert')).toBeTruthy();
    expect(element.querySelector('div.alert').textContent).toContain('customer.credentials.login.not_unique.error');
  });
});
