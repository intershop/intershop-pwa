import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormsDynamicModule } from './forms-dynamic.module';

describe('Forms Dynamic', () => {
  let fixture: ComponentFixture<DummyComponent>;
  let component: DummyComponent;
  let element: HTMLElement;

  @Component({
    template: ` <formly-form [form]="form" [options]="options" [model]="model" [fields]="fields"></formly-form> `,
  })
  class DummyComponent {
    @Input() form = new FormGroup({});
    @Input() options: FormlyFormOptions;
    @Input() model = {};
    @Input() fields: FormlyFieldConfig[];
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [FormlyModule, FormsDynamicModule, ReactiveFormsModule, TranslateModule.forRoot()],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display nothing when no field config was supplied', () => {
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`<formly-form></formly-form>`);
  });

  it('should display dynamic input when supplied as field', () => {
    component.fields = [
      {
        key: 'text',
        type: 'input',
        templateOptions: {
          type: 'text',
        },
      },
    ];

    fixture.detectChanges();
    expect(element.querySelector('ish-input')).toBeTruthy();
  });

  it('should display dynamic select when supplied as field', () => {
    component.fields = [
      {
        key: 'text',
        type: 'select',
        templateOptions: {},
      },
    ];

    fixture.detectChanges();
    expect(element.querySelector('ish-select')).toBeTruthy();
  });

  it('should display dynamic checkbox when supplied as field', () => {
    component.fields = [
      {
        key: 'text',
        type: 'checkbox',
        fieldGroupClassName: 'dummy',
        templateOptions: {},
      },
    ];

    fixture.detectChanges();
    expect(element.querySelector('ish-checkbox')).toBeTruthy();
  });
});
