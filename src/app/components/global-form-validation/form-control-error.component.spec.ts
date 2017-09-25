import { TestBed } from "@angular/core/testing";
import { BrowserModule, By } from "@angular/platform-browser";
import { ComponentFixture } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { FormControlErrorComponent } from "./form-control-error.component";
import { FormControl, FormControlName, Validators } from "@angular/forms";

fdescribe('Form control error component', () => {
    let fixture: ComponentFixture<FormControlErrorComponent>;
    let component: FormControlErrorComponent;
    let smallElement: DebugElement;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
            ],
            declarations: [
                FormControlErrorComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormControlErrorComponent);
        component = fixture.componentInstance;
    });
    it('should not create form control error', () => {
        smallElement = fixture.debugElement.query(By.css('small'));
        expect(smallElement).toBeFalsy();
    });
    it('should create form control error', () => {
        component.messagesList = ['error1'];
        fixture.detectChanges();
        smallElement = fixture.debugElement.query(By.css('small'));
        expect(smallElement).toBeTruthy();
    });

});