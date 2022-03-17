import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FormControlFeedbackComponent } from './form-control-feedback.component';

describe('Form Control Feedback Component', () => {
  let fixture: ComponentFixture<FormControlFeedbackComponent>;
  let component: FormControlFeedbackComponent;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [FormControlFeedbackComponent, MockComponent(FaIconComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormControlFeedbackComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.control = new FormControl('', [Validators.required, Validators.minLength(3)]);
    component.messages = {
      required: 'requiredkey',
      minlength: 'lengthkey',
    };
  });

  function getErrorDisplay() {
    return fixture.debugElement.queryAll(By.css('small'));
  }

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should have errors, but should not show them when control is pristine', () => {
    component.control.setValue('');
    fixture.detectChanges();

    expect(component.control.errors.required).toBeTruthy();
    expect(getErrorDisplay()).toBeEmpty();
  });

  it('should display errors when control is dirty', () => {
    component.control.setValue('a');
    component.control.markAsDirty();
    fixture.detectChanges();
    const elements = getErrorDisplay();

    expect(component.control.errors.minlength).toBeTruthy();
    expect(elements).toHaveLength(1);
    expect(elements[0].nativeElement.textContent).toContain('lengthkey');
  });

  it('should show hidden existing error when marked as dirty', () => {
    component.control.setValue('');
    expect(component.control.errors.required).toBeTruthy();
    fixture.detectChanges();
    expect(getErrorDisplay()).toBeEmpty();

    component.control.markAsDirty();
    fixture.detectChanges();
    expect(getErrorDisplay()).toHaveLength(1);
  });

  function getIcon() {
    return fixture.debugElement.query(By.css('fa-icon'));
  }

  it('should display contextual icons for control', () => {
    let icon;

    // form invalid and pristine
    component.control.setValue('');
    fixture.detectChanges();
    expect(getIcon()).toBeFalsy();

    // form invalid and dirty
    component.control.markAsDirty();
    fixture.detectChanges();
    icon = getIcon();
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.getAttributeNode('ng-reflect-icon').value).toBe('fas,times');
    expect(icon.nativeElement.getAttributeNode('ng-reflect-icon').value).not.toBe('fas,check');

    // form valid and dirty
    component.control.setValue('abcd');
    fixture.detectChanges();
    icon = getIcon();
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.getAttributeNode('ng-reflect-icon').value).not.toBe('fas,times');
    expect(icon.nativeElement.getAttributeNode('ng-reflect-icon').value).toBe('fas,check');
  });
});
