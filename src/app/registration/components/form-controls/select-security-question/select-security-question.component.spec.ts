import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito';
import { SelectSecurityQuestionComponent } from './select-security-question.component';

describe('Select Security Question Component', () => {
  let component: SelectSecurityQuestionComponent;
  let fixture: ComponentFixture<SelectSecurityQuestionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const translateServiceMock = mock(TranslateService);
    when(translateServiceMock.get(anything())).thenCall((data) => {
      if (data === 'labelKey') {
        return Observable.of('LabelName');
      } else {
        return Observable.of(null);
      }
    });
    TestBed.configureTestingModule({
      declarations: [SelectSecurityQuestionComponent],
      providers: [
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(SelectSecurityQuestionComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const form = new FormGroup({
          securityQuestion: new FormControl()
        });
        component.form = form;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName).toEqual('securityQuestion', 'control Name should be <securityQuestion>');
    expect(component.label).toEqual('Security Question', 'label should be <Security Question>');
  });

  it('should get and display security questions on creation', () => {
    fixture.detectChanges();
    expect(component.options.length).toEqual(5, '5 questions are in the options array'); // ToDo: questions are retrieved from a service
    expect(element.querySelector('select[data-testing-id=securityQuestion]')).toBeTruthy('security question select is rendered');
  });
});
