import { CommonModule } from '@angular/common';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormValidationDirective } from './form-validation.directive';

@Component({
  template: `
            <form isFormValidation name="loginForm" [formGroup]="loginForm" >
              <input class="form-control" formControlName="userName" name="userName" />
              <button type="submit" class="btn btn-primary" >Submit</button>
            </form>
            `
})

// tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
class MockComponent {

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required]
    });
  }
}

describe('Form Validation Directive', () => {
  let fixture: ComponentFixture<MockComponent>;
  let component: MockComponent;
  let formValidationElement: DebugElement;
  let formValidationDirective: FormValidationDirective;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        MockComponent,
        FormValidationDirective
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    formValidationElement = fixture.debugElement.query(By.directive(FormValidationDirective));
    formValidationDirective = formValidationElement.injector.get(FormValidationDirective) as FormValidationDirective;
    fixture.detectChanges();
  });

  it('should detect that form is invalid when form with required field is submitted empty', () => {
    formValidationDirective.onSubmit();
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should detect that form is valid when form with required field is submitted after setting content', () => {
    component.loginForm.controls['userName'].setValue('test');
    formValidationDirective.onSubmit();
    expect(formValidationDirective.formGroup.valid).toBe(component.loginForm.valid);
  });
});
