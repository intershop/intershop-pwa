import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';

import { MaxlengthDescriptionWrapperComponent } from './maxlength-description-wrapper.component';

describe('Maxlength Description Wrapper Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'textarea', component: FormlyTestingExampleComponent }],
          wrappers: [{ name: 'maxlength-description-wrapper', component: MaxlengthDescriptionWrapperComponent }],
        }),
        FormlyTestingComponentsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [MaxlengthDescriptionWrapperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    translateService.use('en');
    translateService.set('textarea.max_limit', '{{0}}');

    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.testComponentInputs = {
      fields: [
        {
          key: 'textarea',
          type: 'textarea',
          wrappers: ['maxlength-description-wrapper'],
          props: {
            maxLength: 1000,
          },
        },
      ],
      model: {
        textarea: undefined,
      },
      form: new FormGroup({}),
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be rendered after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-maxlength-description-wrapper')).toBeTruthy();
  });

  it('should display maxLength on empty field', () => {
    component.form.get('textarea')?.setValue('');
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="maxlength-description"]')?.textContent.trim()).toEqual('1000');
  });

  it('should display correct remaining length if field is not empty', fakeAsync(() => {
    fixture.detectChanges();
    component.form.get('textarea')?.setValue('0123456789');
    tick(1000);
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="maxlength-description"]')?.textContent.trim()).toEqual('990');
  }));
});
