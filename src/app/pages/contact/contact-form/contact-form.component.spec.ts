import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';
import { anything, instance, mock, spy, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { ContactFormComponent } from './contact-form.component';

describe('Contact Form Component', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const accountFacade = mock(AccountFacade);
    when(accountFacade.user$).thenReturn(EMPTY);
    when(accountFacade.contactSubjects$()).thenReturn(of(['subject1', 'subject2']));

    await TestBed.configureTestingModule({
      declarations: [ContactFormComponent],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: AccountFacade, useFactory: () => instance(accountFacade) }],
    }).compileComponents();
  });

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

  it('should always render formly form', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('formly-field')).toHaveLength(7);
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
