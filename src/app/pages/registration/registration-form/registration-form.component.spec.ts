import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { anything, instance, mock, spy, verify, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { AddressFormContainerComponent } from 'ish-shared/address-forms/components/address-form-container/address-form-container.component';
import { AddressFormFactory } from 'ish-shared/address-forms/components/address-form/address-form.factory';
import { AddressFormFactoryProvider } from 'ish-shared/address-forms/configurations/address-form-factory.provider';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';

import { LazyCaptchaComponent } from '../../../extensions/captcha/exports/captcha/lazy-captcha/lazy-captcha.component';
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
        MockComponent(CheckboxComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(LazyCaptchaComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(RegistrationCompanyFormComponent),
        MockComponent(RegistrationCredentialsFormComponent),
        MockDirective(ServerHtmlDirective),
        RegistrationFormComponent,
      ],
      providers: [{ provide: AddressFormFactoryProvider, useFactory: () => instance(addressFormFactoryProviderMock) }],
      imports: [
        FeatureToggleModule.forTesting('businessCustomerRegistration'),
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.inject(FormBuilder);
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
      captcha: 'FAKE_CAPTCHA_RESPONSE',
      captchaAction: 'create_account',
    });

    component.create.subscribe(() => {
      done();
    });

    component.submitForm();
    fixture.detectChanges();
  });

  it('should throw create event if t&c checkbox is checked', done => {
    component.form = fb.group({
      control: new FormControl('foo', Validators.required),
      credentials: fb.group({}),
      address: fb.group({}),
      termsAndConditions: true,
      captcha: 'FAKE_CAPTCHA_RESPONSE',
      captchaAction: 'create_account',
    });
    component.create.subscribe(() => {
      done();
    });

    component.submitForm();
    fixture.detectChanges();
  });

  it('should not emit an event if t&c checkbox is empty', () => {
    const emitter = spy(component.create);

    fixture.detectChanges();
    component.submitForm();
    verify(emitter.emit(anything())).never();
  });
});
