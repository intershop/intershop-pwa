import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { anything, instance, mock, when } from 'ts-mockito';
import { AddressFormFactory } from '../../../forms/address/components/address-form/address-form.factory';
import { AddressFormFactoryProvider } from '../../../forms/address/configurations/address-form-factory.provider';
import { FormsSharedModule } from '../../../forms/forms-shared.module';
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

  it('should throw cancel event when cancel is clicked', () => {
    let fired = false;
    component.cancel.subscribe(() => {
      fired = true;
    });

    component.cancelForm();
    expect(fired).toBeTruthy();
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

  it('should NOT throw create event for invalid form', () => {
    component.form = new FormGroup({
      control: new FormControl('', Validators.required),
    });

    let fired = false;
    component.create.subscribe(() => {
      fired = true;
    });

    component.submitForm();
    fixture.detectChanges();
    expect(fired).toBeFalsy();
  });

  it('should throw create event for valid form (and not when invalid)', () => {
    component.form = fb.group({
      control: new FormControl('foo', Validators.required),
      credentials: fb.group({}),
      address: fb.group({}),
    });

    let fired = false;
    component.create.subscribe(() => {
      fired = true;
    });

    component.submitForm();
    fixture.detectChanges();
    expect(fired).toBeTruthy();
  });
});
