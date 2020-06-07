import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, spy, verify } from 'ts-mockito';

import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { SelectComponent, SelectOption } from 'ish-shared/forms/components/select/select.component';
import { TextareaComponent } from 'ish-shared/forms/components/textarea/textarea.component';

import { LazyCaptchaComponent } from '../../../extensions/captcha/exports/captcha/lazy-captcha/lazy-captcha.component';

import { ContactFormComponent } from './contact-form.component';

describe('Contact Form Component', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactFormComponent,
        MockComponent(InputComponent),
        MockComponent(LazyCaptchaComponent),
        MockComponent(SelectComponent),
        MockComponent(TextareaComponent),
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should map subjects to select options when subjects are provided by Input', () => {
    component.subjects = ['Return', 'Product Questions'];
    component.ngOnChanges();
    const expected: SelectOption[] = [
      { label: 'Return', value: 'Return' },
      { label: 'Product Questions', value: 'Product Questions' },
    ];
    expect(component.subjectOptions).toEqual(expected);
  });

  it('should not emit contact request when invalid form is submitted', () => {
    const emitter = spy(component.request);
    fixture.detectChanges();
    component.submitForm();
    verify(emitter.emit(anything())).never();
    expect(component.submitted).toBeTrue();
  });

  it('should emit contact request when valid form is submitted', () => {
    const emitter = spy(component.request);
    fixture.detectChanges();
    component.contactForm.get('name').setValue('Miller, Patricia');
    component.contactForm.get('email').setValue('pmiller@test.intershop.de');
    component.contactForm.get('phone').setValue('123456');
    component.contactForm.get('order').setValue('456789');
    component.contactForm.get('subject').setValue('Return');
    component.contactForm.get('comment').setValue('want to return stuff');
    component.submitForm();
    verify(emitter.emit(anything())).once();
  });
});
