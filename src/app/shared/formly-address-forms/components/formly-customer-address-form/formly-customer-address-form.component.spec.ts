import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, spy, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { FormlyAddressExtensionFormComponent } from 'ish-shared/formly-address-forms/components/formly-address-extension-form/formly-address-extension-form.component';
import { FormlyAddressFormComponent } from 'ish-shared/formly-address-forms/components/formly-address-form/formly-address-form.component';

import { FormlyCustomerAddressFormComponent } from './formly-customer-address-form.component';

describe('Formly Customer Address Form Component', () => {
  let component: FormlyCustomerAddressFormComponent;
  let fixture: ComponentFixture<FormlyCustomerAddressFormComponent>;
  let element: HTMLElement;
  const accountFacade = mock(AccountFacade);
  const formGroupDirective = mock(FormGroupDirective);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FormlyCustomerAddressFormComponent,
        MockComponent(FormlyAddressExtensionFormComponent),
        MockComponent(FormlyAddressFormComponent),
      ],
      imports: [
        FeatureToggleModule.forTesting('businessCustomerRegistration'),
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyCustomerAddressFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.addressForm = formGroupDirective;
    when(accountFacade.isBusinessCustomer$).thenReturn(of(false));
    when(formGroupDirective.resetForm()).thenReturn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should create an address form on creation', () => {
    expect(component.form).toBeUndefined();
    fixture.detectChanges();
    expect(component.form.get('address')).toBeTruthy();
  });

  it('should render an address form component on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-formly-address-form')).toBeTruthy();
    expect(element.querySelector('ish-formly-address-extension-form')).toBeFalsy();
  });

  it('should throw cancel event when cancel is clicked', () => {
    const emitter = spy(component.cancel);

    component.cancelForm();

    verify(emitter.emit()).once();
  });

  it('should NOT throw submit event for invalid form', () => {
    component.form = new FormGroup({
      control: new FormControl('', Validators.required),
    });

    const emitter = spy(component.save);

    component.submitForm();

    verify(emitter.emit(anything())).never();
  });

  it('should throw submit event for valid form (and not when invalid)', () => {
    component.form = new FormGroup({
      control: new FormControl('foo', Validators.required),
      address: new FormGroup({}),
    });
    const emitter = spy(component.save);

    component.submitForm();

    verify(emitter.emit(anything())).once();
  });

  it('should reset the form if resetForm changes and is true', () => {
    component.form = new FormGroup({
      address: new FormGroup({
        countryCode: new FormControl('foo', Validators.required),
      }),
    });
    const changes: SimpleChanges = {
      resetForm: new SimpleChange(false, true, false),
    };
    component.ngOnChanges(changes);

    expect(component.form.value.address.countryCode).toBeFalsy();
  });

  it('should not reset the form if resetForm changes and is false', () => {
    component.form = new FormGroup({
      address: new FormGroup({
        countryCode: new FormControl('foo', Validators.required),
      }),
    });
    const changes: SimpleChanges = {
      resetForm: new SimpleChange(false, false, false),
    };
    component.ngOnChanges(changes);

    expect(component.form.value.address.countryCode).toEqual('foo');
  });

  it('should render the extension form if extension is true', () => {
    component.extension = true;
    fixture.detectChanges();
    expect(element.querySelector('ish-formly-address-extension-form')).toBeTruthy();
  });
});
