import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { InlineValidationWrapperComponent } from './inline-validation-wrapper.component';

type TestField = FormlyFieldConfig & {
  formControl: FormControl;
  form: FormGroup & { submitted: boolean };
};

describe('Inline Validation Wrapper Component', () => {
  let component: InlineValidationWrapperComponent;
  let fixture: ComponentFixture<InlineValidationWrapperComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InlineValidationWrapperComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(InlineValidationWrapperComponent);
    component = fixture.componentInstance;

    const defaultField: TestField = {
      id: 'test-id',
      type: '',
      props: {},
      validators: {},
      asyncValidators: {},
      formControl: new FormControl({}),
      form: new FormGroup({}) as FormGroup & { submitted: boolean },
    };
    defaultField.form.submitted = false;

    component.field = defaultField;

    Object.defineProperty(component, 'showError', {
      get: () => false,
    });

    fixture.detectChanges();
    element = fixture.nativeElement as HTMLElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show validation icons if validators are present', () => {
    component.field = {
      ...component.field,
      validators: { required: true },
    };

    expect(component.showValidationIcons()).toBeTruthy();
  });

  it('should show validation icons if asyncValidators are present', () => {
    component.field = {
      ...component.field,
      asyncValidators: { asyncCheck: (): null => undefined },
    };

    expect(component.showValidationIcons()).toBeTruthy();
  });

  it('should show validation icons if required is set in props', () => {
    component.field = {
      ...component.field,
      props: { required: true },
    };

    expect(component.showValidationIcons()).toBeTruthy();
  });

  it('should hide validation icons if neither validators nor required are set', () => {
    component.field = {
      ...component.field,
      validators: {},
      asyncValidators: {},
      props: {},
    };

    expect(component.showValidationIcons()).toBeFalsy();
  });
});
