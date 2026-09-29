import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslatePipe, TranslateService, provideTranslateService } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { TextInputFieldComponent } from './text-input-field.component';

describe('Text Input Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextInputFieldComponent],
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'ish-text-input-field', component: TextInputFieldComponent }],
        }),
        FormlyTestingComponentsModule,
        NgxMaskDirective,
        ReactiveFormsModule,
        TranslatePipe,
      ],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          key: 'input',
          type: 'ish-text-input-field',
          props: {
            label: 'test label',
            required: true,
          },
        } as FormlyFieldConfig,
      ],
      form: new FormGroup({}),
      model: {
        input: '',
      },
    };

    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.testComponentInputs = testComponentInputs;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-text-input-field > input')).toBeTruthy();
  });

  describe('with mask', () => {
    let form: FormGroup;

    function renderMaskedField(mask: string, value: number | string = '') {
      form = new FormGroup({});
      component.testComponentInputs = {
        fields: [{ key: 'input', type: 'ish-text-input-field', props: { mask } } as FormlyFieldConfig],
        form,
        model: { input: value },
      };
      fixture.detectChanges();
      return element.querySelector<HTMLInputElement>('ish-text-input-field > input');
    }

    function typeInto(input: HTMLInputElement, text: string) {
      input.dispatchEvent(new Event('focus'));
      for (const char of text) {
        input.dispatchEvent(new KeyboardEvent('keydown', { key: char }));
        input.value += char;
        input.setSelectionRange(input.value.length, input.value.length);
        input.dispatchEvent(new InputEvent('input', { data: char, inputType: 'insertText' }));
        fixture.detectChanges();
      }
    }

    it.each(['12345678', 'DEUTDEFF500'])('should keep the model value %s intact for a non-separator mask', value => {
      const input = renderMaskedField('AAAAAAAA||AAAAAAAAAAA');
      typeInto(input, value);

      expect(input.value).toEqual(value);
      expect(form.get('input').value).toEqual(value);
    });

    it.each`
      lang       | typed        | display
      ${'en_US'} | ${'1234.56'} | ${'1,234.56'}
      ${'de_DE'} | ${'1234,56'} | ${'1.234,56'}
    `('should use the $lang separators for a separator mask', ({ lang, typed, display }) => {
      TestBed.inject(TranslateService).use(lang);
      const input = renderMaskedField('separator.2');
      typeInto(input, typed);

      expect(input.value).toEqual(display);
      expect(form.get('input').value).toEqual(1234.56);
    });

    it.each`
      lang       | display
      ${'en_US'} | ${'1,234.50'}
      ${'de_DE'} | ${'1.234,50'}
    `('should format an initial value with the $lang separators for a separator mask', ({ lang, display }) => {
      TestBed.inject(TranslateService).use(lang);
      const input = renderMaskedField('separator.2', 1234.5);

      expect(input.value).toEqual(display);
    });
  });
});
