import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FormControlFeedbackComponent } from 'ish-shared/forms/components/form-control-feedback/form-control-feedback.component';
import { ShowFormFeedbackDirective } from 'ish-shared/forms/directives/show-form-feedback.directive';

import { SelectSecurityQuestionComponent } from './select-security-question.component';

describe('Select Security Question Component', () => {
  let component: SelectSecurityQuestionComponent;
  let fixture: ComponentFixture<SelectSecurityQuestionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(FormControlFeedbackComponent),
        MockDirective(ShowFormFeedbackDirective),
        SelectSecurityQuestionComponent,
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SelectSecurityQuestionComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const form = new FormGroup({
          securityQuestion: new FormControl(),
        });
        component.form = form;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName).toEqual('securityQuestion');
    expect(component.label).toEqual('account.security_question.label');
  });

  it('should get and display security questions on creation', () => {
    fixture.detectChanges();
    expect(component.options).toHaveLength(5); // ToDo: questions are retrieved from a service
    expect(element.querySelector('[data-testing-id=securityQuestion]')).toBeTruthy();
  });
});
