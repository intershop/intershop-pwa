import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { ShowFormFeedbackDirective } from './show-form-feedback.directive';

/* tslint:disable:prefer-mocks-instead-of-stubs-in-tests */
@Component({
  template: `<div [ishShowFormFeedback]="control"></div>`
})
class TestComponent {
  control = new FormControl('', Validators.required);
}

describe('ShowFormFeedbackDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  const errorClass = 'has-error';
  const successClass = 'has-success';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      declarations: [
        TestComponent,
        ShowFormFeedbackDirective
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getClasses() {
    return fixture.debugElement.query(By.css('div')).classes;
  }

  it('should set no class when form is pristine', () => {
    component.control.setValue('');
    fixture.detectChanges();
    expect(getClasses()[errorClass]).toBeFalsy();
    expect(getClasses()[successClass]).toBeFalsy();

    component.control.setValue('a');
    fixture.detectChanges();
    expect(getClasses()[errorClass]).toBeFalsy();
    expect(getClasses()[successClass]).toBeFalsy();
  });

  it('should set error CSS class when form is invalid and dirty', () => {
    component.control.setValue('');
    component.control.markAsDirty();
    fixture.detectChanges();

    expect(component.control.invalid).toBeTruthy();
    expect(getClasses()[errorClass]).toBeTruthy();
    expect(getClasses()[successClass]).toBeFalsy();
  });

  it('should set success CSS class when form is valid and dirty', () => {
    component.control.setValue('a');
    component.control.markAsDirty();
    fixture.detectChanges();

    expect(component.control.valid).toBeTruthy();
    expect(getClasses()[errorClass]).toBeFalsy();
    expect(getClasses()[successClass]).toBeTruthy();
  });
});
