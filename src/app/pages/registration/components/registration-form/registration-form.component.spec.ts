import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { HttpError, HttpHeader } from 'ish-core/models/http-error/http-error.model';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { AddressFormFactory } from '../../../../shared/address-forms/components/address-form/address-form.factory';
import { AddressFormFactoryProvider } from '../../../../shared/address-forms/configurations/address-form-factory.provider';
import { AddressFormContainerComponent } from '../../../../shared/address-forms/containers/address-form/address-form.container';
import { FormsSharedModule } from '../../../../shared/forms/forms.module';
import { RegistrationCompanyFormComponent } from '../registration-company-form/registration-company-form.component';
import { RegistrationCredentialsFormComponent } from '../registration-credentials-form/registration-credentials-form.component';

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
        MockComponent(AddressFormContainerComponent),
        MockComponent(RegistrationCompanyFormComponent),
        MockComponent(RegistrationCredentialsFormComponent),
        RegistrationFormComponent,
      ],
      providers: [{ provide: AddressFormFactoryProvider, useFactory: () => instance(addressFormFactoryProviderMock) }],
      imports: [
        FeatureToggleModule,
        FormsSharedModule,
        ReactiveFormsModule,
        StoreModule.forRoot(
          { configuration: configurationReducer },
          { initialState: { configuration: { features: ['businessCustomerRegistration'] } } }
        ),
        TranslateModule.forRoot(),
      ],
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
    expect(component.form.get('taxationID')).toBeTruthy();
  });

  it('should display registration company form for a business customer registration', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-registration-company-form')).toBeTruthy();
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

    expect(element.querySelector('[role="alert"]')).toBeTruthy();
    expect(element.querySelector('[role="alert"]').textContent).toContain(
      'customer.credentials.login.not_unique.error'
    );
  });
});
