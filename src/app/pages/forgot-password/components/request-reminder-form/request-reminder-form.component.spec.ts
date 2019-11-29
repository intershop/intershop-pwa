import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { CaptchaComponent } from 'ish-shared/forms/components/captcha/captcha.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { RequestReminderFormComponent } from './request-reminder-form.component';

describe('Request Reminder Form Component', () => {
  let component: RequestReminderFormComponent;
  let fixture: ComponentFixture<RequestReminderFormComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(CaptchaComponent), MockComponent(InputComponent), RequestReminderFormComponent],
      imports: [
        FeatureToggleModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ngrxTesting({ reducers: coreReducers }),
      ],
    }).compileComponents();
  }));

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

    expect(element.querySelector('ish-input[controlname=email]')).toBeTruthy();
    expect(element.querySelector('ish-input[controlname=firstName]')).toBeTruthy();
    expect(element.querySelector('ish-input[controlname=lastName]')).toBeTruthy();
    expect(element.querySelector('[name="passwordReminder"]')).toBeTruthy();
  });

  describe('email format', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should not detect error if email is well formed', () => {
      component.form.controls.email.setValue('test@test.com');
      expect(component.form.controls.email.valid).toBeTruthy();
    });

    it('should detect error if email is malformed', () => {
      component.form.controls.email.setValue('testtest.com');
      expect(component.form.controls.email.valid).toBeFalsy();
    });
  });
});
