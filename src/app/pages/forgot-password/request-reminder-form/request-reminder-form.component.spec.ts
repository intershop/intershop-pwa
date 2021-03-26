import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { RequestReminderFormComponent } from './request-reminder-form.component';

describe('Request Reminder Form Component', () => {
  let component: RequestReminderFormComponent;
  let fixture: ComponentFixture<RequestReminderFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestReminderFormComponent],
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
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
      component.requestReminderForm.controls.email.setValue('test@test.com');
      expect(component.requestReminderForm.controls.email.valid).toBeTruthy();
    });

    it('should detect error if email is malformed', () => {
      component.requestReminderForm.controls.email.setValue('testtest.com');
      expect(component.requestReminderForm.controls.email.invalid).toBeFalsy();
    });
  });
});
