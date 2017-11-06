import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../modules/shared.module';
import { EmailPasswordComponent } from './email-password.component';

describe('EmailPassword Component', () => {
  let fixture: ComponentFixture<EmailPasswordComponent>;
  let component: EmailPasswordComponent;
  let element: HTMLElement;
  let debugEl: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmailPasswordComponent],
      imports: [
        SharedModule,
        TranslateModule.forRoot()
      ]
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

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form when created', () => {
    expect(component.emailForm).not.toBe(null);
  });

  it('should be invalid when invalid values are entered', () => {
    component.emailForm.get('emailDetails.password').setValue('newPassword');
    component.emailForm.get('emailDetails.confirmPassword').setValue('newPassword12');
    expect(component.emailForm.get('emailDetails.confirmPassword').value).toBe('newPassword12');
    component.emailForm.get('emailDetails.password').setValue('newPassword123');
    expect(component.emailForm.valid).toBe(false);
  });

  it('should be valid when valid values are entered', () => {
    component.emailForm.get('emailDetails.emailAddress').setValue('intershop@123.com');
    component.emailForm.get('emailDetails.confirmEmailAddress').setValue('intershop@123.com');
    component.emailForm.get('emailDetails.password').setValue('intershop1@Aqwe');
    component.emailForm.get('emailDetails.confirmPassword').setValue('intershop1@Aqwe');
    component.emailForm.get('emailDetails.securityQuestion').setValue('First pet');
    component.emailForm.get('emailDetails.answer').setValue('dog');
    component.emailForm.get('emailDetails.receivePromotions').setValue(true);
    expect(component.emailForm.valid).toBe(true);
  });

  xit('should test all the conditions of the matchWordsValidator', () => {
    component.emailForm.get('emailDetails.password').setValue('!nterShop');
    component.emailForm.get('emailDetails.confirmPassword').setValue('!nterShop');
    expect(component.emailForm.get('emailDetails.confirmPassword').value).toEqual('!nterShop');
  });


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
