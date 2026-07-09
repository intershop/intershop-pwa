import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { RequestReminderFormComponent } from './request-reminder-form.component';

describe('Request Reminder Form Component', () => {
  let component: RequestReminderFormComponent;
  let fixture: ComponentFixture<RequestReminderFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const mockAppFacade = mock(AppFacade);
    when(mockAppFacade.serverSetting$<boolean>(anyString())).thenReturn(of(false));
    when(
      mockAppFacade.serverSetting$<string>('preferences.UserCredentialPreferences.UserRegistrationLoginType')
    ).thenReturn(of('email'));

    await TestBed.configureTestingModule({
      declarations: [RequestReminderFormComponent],
      imports: [FormlyTestingModule, TranslatePipe],
      providers: [{ provide: AppFacade, useFactory: () => instance(mockAppFacade) }, provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestReminderFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render forgot password form for password reminder', () => {
    fixture.detectChanges();

    expect(element.innerHTML.match(/ish-email-field/g)).toHaveLength(1);
    expect(element.innerHTML).toContain('passwordReminder');
  });

  describe('email format', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should not detect error if email is well formed', () => {
      component.requestReminderForm.controls.email.setValue('test@test.intershop.com');
      expect(component.requestReminderForm.controls.email.valid).toBeTruthy();
    });

    it('should detect error if email is malformed', () => {
      component.requestReminderForm.controls.email.setValue('testtest.com');
      expect(component.requestReminderForm.controls.email.invalid).toBeFalsy();
    });
  });
});
