import { CommonModule } from '@angular/common';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormValidationDirective } from './form-validation.directive';
@Component({
    template: ` <form name="loginForm" [formGroup]="loginForm" >
                <input class="form-control" formControlName="userName" name="userName" />
                <button type="submit" class="btn btn-primary" >Submit</button>
                </form>
                    `
})
class MockComponent {
    loginForm: FormGroup;
    constructor(private formBuilder: FormBuilder) {
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

    it('should return invalid form', () => {
        formValidationDirective.onSubmit();
        expect(component.loginForm.invalid).toBe(true);
    });

    it('should return valid form', () => {
        component.loginForm.controls['userName'].setValue('test');
        formValidationDirective.onSubmit();
        expect(formValidationDirective.formGroup.valid).toBe(component.loginForm.valid);
    });
});


