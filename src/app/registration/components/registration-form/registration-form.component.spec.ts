import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { anything, instance, mock, when } from 'ts-mockito';
import { AddressFormFactory, AddressFormService } from '../../../shared/address-form/index';
import { SharedModule } from '../../../shared/shared.module';
import { MockComponent } from '../../../utils/dev/mock.component';
import { RegistrationFormComponent } from './registration-form.component';

describe('RegistrationForm Component', () => {
  let fixture: ComponentFixture<RegistrationFormComponent>;
  let component: RegistrationFormComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    const addressFormFactoryMock = mock(AddressFormFactory);
    when(addressFormFactoryMock.getGroup(anything())).thenReturn(
      new FormGroup({})
    );

    const addressFormServiceMock = mock(AddressFormService);
    when(addressFormServiceMock.getFactory(anything())).thenReturn(
      addressFormFactoryMock
    );

    TestBed.configureTestingModule({
      declarations: [RegistrationFormComponent,
        MockComponent({
          selector: 'ish-registration-credentials-form',
          template: 'Credentials Template',
          inputs: ['parentForm', 'controlName']
        }),
        MockComponent({
          selector: 'ish-address-form',
          template: 'Address Template',
          inputs: ['parentForm', 'controlName', 'countryCode', 'regions', 'countries', 'titles']
        }),
      ],
      providers: [
        { provide: AddressFormService, useFactory: () => instance(addressFormServiceMock) }
      ],
      imports: [
        SharedModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should create a registration form on creation', () => {
    expect(component.form).toBeUndefined('registration form has not been created before init');
    fixture.detectChanges();
    expect(component.form.get('preferredLanguage')).toBeTruthy('registration form contains a preferredLanguage control');
    expect(component.form.get('birthday')).toBeTruthy('registration form contains a birthday control');
  });

  it('should throw cancel event when cancel is clicked', () => {

    let fired = false;
    component.cancel.subscribe(() => {
      fired = true;
    });

    component.cancelForm();
    expect(fired).toBeTruthy('cancel event fired');
  });

  it('should set submitted flag if submit is clicked and form is not valid', async(() => {
    component.form = new FormGroup({
      preferredLanguage: new FormControl('', Validators.required),
    });
    expect(component.submitted).toBeFalsy('submitted is false after component init');
    component.submitForm();
    fixture.whenStable().then(() => {
      expect(component.submitted).toBeTruthy('submitted is true after submitting an invalid form');
    });
  }));

  it('should NOT throw create event for invalid form', () => {
    component.form = new FormGroup({
      control: new FormControl('', Validators.required)
    });

    let fired = false;
    component.create.subscribe(() => {
      fired = true;
    });

    component.submitForm();
    fixture.detectChanges();
    expect(fired).toBeFalsy('invalid form does not trigger event');
  });

  it('should throw create event for valid form (and not when invalid)', () => {
    component.form = new FormGroup({
      control: new FormControl('foo', Validators.required)
    });

    let fired = false;
    component.create.subscribe(() => {
      fired = true;
    });

    component.submitForm();
    fixture.detectChanges();
    expect(fired).toBeTruthy('valid form triggers event');
  });
});
