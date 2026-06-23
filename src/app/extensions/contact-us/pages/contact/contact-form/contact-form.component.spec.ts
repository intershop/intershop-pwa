import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';
import { anyString, anything, instance, mock, spy, verify, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { ContactUsFacade } from '../../../facades/contact-us.facade';

import { ContactFormComponent } from './contact-form.component';

describe('Contact Form Component', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const accountFacade = mock(AccountFacade);
    when(accountFacade.user$).thenReturn(EMPTY);
    when(accountFacade.isLoggedIn$).thenReturn(of(true));

    const contactUsFacade = mock(ContactUsFacade);
    when(contactUsFacade.contactSubjects$()).thenReturn(of(['subject1', 'subject2']));

    const mockAppFacade = mock(AppFacade);
    when(mockAppFacade.serverSetting$<boolean>(anyString())).thenReturn(of(false));

    await TestBed.configureTestingModule({
      declarations: [ContactFormComponent],
      imports: [FormlyTestingModule, TranslatePipe],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
        { provide: AppFacade, useFactory: () => instance(mockAppFacade) },
        { provide: ContactUsFacade, useFactory: () => instance(contactUsFacade) },
        provideTranslateService(),
      ],
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
    expect(element.querySelectorAll('formly-group formly-field')).toHaveLength(7);
  });

  it('should not emit contact request when invalid form is submitted', () => {
    const emitter = spy(component.request);
    fixture.detectChanges();
    component.submitForm();
    verify(emitter.emit(anything())).never();
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
