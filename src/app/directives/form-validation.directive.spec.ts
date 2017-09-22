import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef, Input, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormValidationDirective } from "./form-validation.directive";
import { FormGroup, FormBuilder, Validators, FormsModule } from "@angular/forms";
import { By } from '@angular/platform-browser';
describe('Form Validation Directive', () => {
    @Component({
        template: ` <form #form name="LoginUserForm" [formGroup]="loginForm" class="form-horizontal bv-form" >
                    <input class="form-control" formControlName="userName" name="ShopLoginForm_Login" />
                    </form>
                        `
    })
    class MockComponent {
        @ViewChild('form') formValidationDirective: FormValidationDirective;
        @Input('formGroup') formGroup: FormGroup;
        loginForm: FormGroup;
        constructor(private formBuilder: FormBuilder) {
            this.loginForm = this.formBuilder.group({
                userName: ['', Validators.required]
            });
        }
    }

    let fixture: ComponentFixture<MockComponent>;
    let component: MockComponent;
    let element: HTMLElement;
    let formValidationDirective: DebugElement[];
    let formGroupDirective: DebugElement[];  

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports:[FormsModule],
            declarations: [FormValidationDirective, MockComponent]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(MockComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
            formValidationDirective = fixture.debugElement.queryAll(By.directive(FormValidationDirective));
            formGroupDirective = fixture.debugElement.queryAll(By.directive(FormGroup));
            
        });
    }));
    xit('form validation directive test case', () => {
        debugger;
        console.log(element);
        fixture.debugElement.query(By.css('form')).triggerEventHandler('submit', null);
        expect(formValidationDirective[0].injector.get(FormValidationDirective).markAsDirty(formGroupDirective[0].injector.get(FormGroup))).toHaveBeenCalled();
    });

});


