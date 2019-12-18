import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, spy, verify } from 'ts-mockito';

import { FeatureToggleModule, FeatureToggleService } from 'ish-core/feature-toggle.module';
import { CaptchaComponent } from 'ish-shared/forms/components/captcha/captcha.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { SelectComponent, SelectOption } from 'ish-shared/forms/components/select/select.component';
import { TextareaComponent } from 'ish-shared/forms/components/textarea/textarea.component';

import { ContactFormComponent } from './contact-form.component';

describe('Contact Form Component', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactFormComponent,
        MockComponent(CaptchaComponent),
        MockComponent(InputComponent),
        MockComponent(SelectComponent),
        MockComponent(TextareaComponent),
      ],
      imports: [FeatureToggleModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [{ provide: FeatureToggleService, useFactory: () => instance(mock(FeatureToggleService)) }],
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
    component.contactForm.get('comments').setValue('want to return stuff');
    component.submitForm();
    verify(emitter.emit(anything())).once();
  });
});
