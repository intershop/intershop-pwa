import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { FormlyAddressExtensionFormComponent } from './formly-address-extension-form.component';

describe('Formly Address Extension Form Component', () => {
  let component: FormlyAddressExtensionFormComponent;
  let fixture: ComponentFixture<FormlyAddressExtensionFormComponent>;
  let element: HTMLElement;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormlyAddressExtensionFormComponent],
      imports: [FormlyTestingModule.withPresetMocks(['taxationID'])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyAddressExtensionFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    fb = TestBed.inject(FormBuilder);

    component.form = fb.group({});
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should always set input field for email', () => {
    fixture.detectChanges();
    expect(component.form.value).toContainKey('email');
  });

  it('should set input field for taxation-id, when businessCustomerRegistration feature is enabled', () => {
    component.businessCustomer = true;
    fixture.detectChanges();
    expect(component.form.value).toContainKey('taxationID');
  });

  it('should not set input field for taxation-id, when businessCustomerRegistration feature is disabled', () => {
    component.businessCustomer = false;
    fixture.detectChanges();
    expect(component.form.value).not.toContainKey('taxationID');
  });
});
