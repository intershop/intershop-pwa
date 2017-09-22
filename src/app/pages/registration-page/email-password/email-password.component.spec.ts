import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { SharedModule } from '../../../modules/shared.module';
//import { matchOtherValidator } from '../../../validators/match-words.validator';
import { EmailPasswordComponent } from './email-password.component';

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
        fixture.detectChanges();
    });

    it('should call ngOnInit method', () => {
        expect(component.emailForm).not.toBe(null);
    });

    it('should call valueChanges method of form and verify that form is not valid', () => {
        component.emailForm.get('emailDetails.password').setValue('newPassword');
        component.emailForm.get('emailDetails.confirmPassword').setValue('newPassword12');
        expect(component.emailForm.get('emailDetails.confirmPassword').value).toBe('newPassword12');

        component.emailForm.get('emailDetails.password').setValue('newPassword123');
        expect(component.emailForm.valid).toBe(false);
    });

    it('should call valueChanges method of form and verify that the form is valid', () => {
        component.emailForm.get('emailDetails.emailAddress').setValue('intershop@123.com');
        component.emailForm.get('emailDetails.confirmEmailAddress').setValue('intershop@123.com');
        component.emailForm.get('emailDetails.password').setValue('intershop1@Aqwe');
        component.emailForm.get('emailDetails.confirmPassword').setValue('intershop1@Aqwe');
        component.emailForm.get('emailDetails.securityQuestion').setValue('First pet');
        component.emailForm.get('emailDetails.answer').setValue('dog');
        component.emailForm.get('emailDetails.receivePromotions').setValue(true);
        expect(component.emailForm.valid).toBe(true);
    });

    /*
      TODO: move test to validators package
     */
    // xit('should test all the conditions of the matchWordsValidator', () => {
    //     //component.emailForm.addControl('TestMatchWords', new FormControl('', [matchOtherValidator('coolTest')]));
    //     component.emailForm.controls['TestMatchWords'].setValue('testValue');
    //     expect(component.emailForm.controls['TestMatchWords'].value).toEqual('testValue');
    // });


    it('should check if controls are rendered on the HTML', () => {
        const elem = element.getElementsByClassName('form-control');
        expect(elem.length).toBe(6);
        expect(elem[0]).toBeTruthy();
        expect(elem[1]).toBeTruthy();
        expect(elem[2]).toBeTruthy();
        expect(elem[3]).toBeTruthy();
        expect(elem[4]).toBeTruthy();
        expect(elem[5]).toBeTruthy();
    });

});
