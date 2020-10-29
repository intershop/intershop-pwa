import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { AddressFormContainerComponent } from 'ish-shared/address-forms/components/address-form-container/address-form-container.component';

import { CustomerAddressFormComponent } from './customer-address-form.component';

describe('Customer Address Form Component', () => {
  let component: CustomerAddressFormComponent;
  let fixture: ComponentFixture<CustomerAddressFormComponent>;
  let element: HTMLElement;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerAddressFormComponent, MockComponent(AddressFormContainerComponent)],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAddressFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fb = TestBed.inject(FormBuilder);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should create an address form on creation', () => {
    expect(component.form).toBeUndefined();
    fixture.detectChanges();
    expect(component.form.get('countryCodeSwitch')).toBeTruthy();
    expect(component.form.get('address')).toBeTruthy();
  });

  it('should render an address form component on creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-address-form-container')).toBeTruthy();
  });

  it('should throw cancel event when cancel is clicked', () => {
    const emitter = spy(component.cancel);

    component.cancelForm();

    verify(emitter.emit()).once();
  });

  it('should set submitted flag if submit is clicked and form is not valid', async () => {
    component.form = new FormGroup({
      control: new FormControl('', Validators.required),
    });
    expect(component.submitted).toBeFalsy();
    component.submitForm();
    await fixture.whenStable();

    expect(component.submitted).toBeTruthy();
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
    component.form = fb.group({
      control: new FormControl('foo', Validators.required),
      address: fb.group({}),
    });
    const emitter = spy(component.save);

    component.submitForm();

    verify(emitter.emit(anything())).once();
  });

  it('should reset the form if resetForm changes and is true', () => {
    component.form = fb.group({
      countryCodeSwitch: new FormControl('foo', Validators.required),
      address: fb.group({}),
    });
    const changes: SimpleChanges = {
      resetForm: new SimpleChange(false, true, false),
    };
    component.ngOnChanges(changes);

    expect(component.form.value.countryCodeSwitch).toBeEmpty();
  });

  it('should not reset the form if resetForm changes and is false', () => {
    component.form = fb.group({
      countryCodeSwitch: new FormControl('foo', Validators.required),
      address: fb.group({}),
    });
    const changes: SimpleChanges = {
      resetForm: new SimpleChange(false, false, false),
    };
    component.ngOnChanges(changes);

    expect(component.form.value.countryCodeSwitch).toEqual('foo');
  });
});
