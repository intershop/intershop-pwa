import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { EmailPasswordComponent } from './email-password.component';
import { matchOtherValidator } from 'app/validators/match-words.validator';
import { SharedModule } from 'app/modules/shared.module';

describe('EmailPassword Component', () => {
    let fixture: ComponentFixture<EmailPasswordComponent>;
    let component: EmailPasswordComponent;
    let element: HTMLElement;
    let debugEl: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EmailPasswordComponent],
            imports: [SharedModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EmailPasswordComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    });

    it('should call ngOnInit method', () => {
        component.ngOnInit();
        expect(component.emailForm).not.toBe(null);
    });

    it('should call valueChanges method of form and verify that form is not valid', () => {
        component.ngOnInit();
        component.emailForm.get('emailDetails.password').setValue('newPassword');
        component.emailForm.get('emailDetails.confirmPassword').setValue('newPassword12');
        expect(component.emailForm.get('emailDetails.confirmPassword').value).toBe('newPassword12');

        component.emailForm.get('emailDetails.password').setValue('newPassword123');
        expect(component.emailForm.valid).toBe(false);
    });

    it('should call valueChanges method of form and verify that the form is valid', () => {
        component.ngOnInit();
        component.emailForm.get('emailDetails.emailAddress').setValue('intershop@123.com');
        component.emailForm.get('emailDetails.confirmEmailAddress').setValue('intershop@123.com');
        component.emailForm.get('emailDetails.password').setValue('intershop1@Aqwe');
        component.emailForm.get('emailDetails.confirmPassword').setValue('intershop1@Aqwe');
        component.emailForm.get('emailDetails.securityQuestion').setValue('First pet');
        component.emailForm.get('emailDetails.answer').setValue('dog');
        component.emailForm.get('emailDetails.receivePromotions').setValue(true);
        expect(component.emailForm.valid).toBe(true);
    });

    it('should test all the conditions of the matchWordsValidator', () => {
        component.ngOnInit();
        component.emailForm.addControl('TestMatchWords', new FormControl('', [matchOtherValidator('coolTest')]));
        component.emailForm.controls['TestMatchWords'].setValue('testValue');
        expect(component.emailForm.controls['TestMatchWords'].value).toEqual('testValue');
    });


    it('should check if controls are rendered on the HTML', () => {
        const elem = element.getElementsByClassName('form-control');
        expect(elem.length).toBe(6);
        expect(elem[0]).toBeDefined();
        expect(elem[1]).toBeDefined();
        expect(elem[2]).toBeDefined();
        expect(elem[3]).toBeDefined();
        expect(elem[4]).toBeDefined();
        expect(elem[5]).toBeDefined();
    });

});
