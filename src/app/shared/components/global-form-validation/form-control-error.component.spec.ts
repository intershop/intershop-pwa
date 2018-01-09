import { Component } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { FormControlErrorComponent } from './form-control-error.component';

describe('FormControlErrorComponent', () => {
  let fixture: ComponentFixture<FormControlErrorComponent>;
  let component: FormControlErrorComponent;
  let translateService: TranslateService;

  beforeEach(() => {
    translateService = mock(TranslateService);

    when(translateService.get('requiredkey'))
      .thenReturn(Observable.of('requiredmessage'));

    when(translateService.get('lengthkey'))
      .thenReturn(Observable.of('lengthmessage'));
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
      declarations: [FormControlErrorComponent],
      providers: [
        { provide: TranslateService, useFactory: () => instance(translateService) }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormControlErrorComponent);
    component = fixture.componentInstance;

    component.control = new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]);
    component.messages = {
      required: 'requiredkey',
      minlength: 'lengthkey'
    };
  });

  function getErrorDisplay() {
    return fixture.debugElement.queryAll(By.css('small'));
  }

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

  it('should display contextual icons', () => {
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
