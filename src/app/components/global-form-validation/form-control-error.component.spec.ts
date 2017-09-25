import { DebugElement } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormControlErrorComponent } from './form-control-error.component';

describe('Form control error component', () => {
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
        smallElement = fixture.debugElement.query(By.css('small'));
    });
    it('should not create form control error', () => {
        expect(smallElement).toBeFalsy();
    });
    it('should create form control error', () => {
        component.messagesList = ['error1'];
        fixture.detectChanges();
        smallElement = fixture.debugElement.query(By.css('small'));
        expect(smallElement).toBeTruthy();
    });

});
