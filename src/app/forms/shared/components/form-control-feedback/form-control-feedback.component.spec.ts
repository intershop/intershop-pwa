import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormControlFeedbackComponent } from './form-control-feedback.component';

describe('Form Control Feedback Component', () => {
  let fixture: ComponentFixture<FormControlFeedbackComponent>;
  let component: FormControlFeedbackComponent;
  let element: HTMLElement;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, TranslateModule.forRoot()],
      declarations: [FormControlFeedbackComponent],
    }).compileComponents();

    translateService = TestBed.get(TranslateService);
    translateService.setDefaultLang('en');
    translateService.use('en');
    translateService.set('requiredkey', 'requiredmessage');
    translateService.set('lengthkey', 'lengthmessage');
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
    expect(getErrorDisplay().length).toBe(0);
  });

  it('should display errors when control is dirty', () => {
    component.control.setValue('a');
    component.control.markAsDirty();
    fixture.detectChanges();
    const elements = getErrorDisplay();

    expect(component.control.errors.minlength).toBeTruthy();
    expect(elements.length).toBe(1);
    expect(elements[0].nativeElement.textContent).toContain('lengthmessage');
  });

  it('should show hidden existing error when marked as dirty', () => {
    component.control.setValue('');
    expect(component.control.errors.required).toBeTruthy();
    fixture.detectChanges();
    expect(getErrorDisplay().length).toBe(0);

    component.control.markAsDirty();
    fixture.detectChanges();
    expect(getErrorDisplay().length).toBe(1);
  });

  function getIcon() {
    return fixture.debugElement.query(By.css('i.glyphicon'));
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
    expect(icon.classes['glyphicon-remove']).toBeTruthy();
    expect(icon.classes['glyphicon-ok']).toBeFalsy();

    // form valid and dirty
    component.control.setValue('abcd');
    fixture.detectChanges();
    icon = getIcon();
    expect(icon).toBeTruthy();
    expect(icon.classes['glyphicon-remove']).toBeFalsy();
    expect(icon.classes['glyphicon-ok']).toBeTruthy();
  });
});
