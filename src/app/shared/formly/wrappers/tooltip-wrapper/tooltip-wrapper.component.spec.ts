import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { MockComponent } from 'ng-mocks';

import { FieldTooltipComponent } from 'ish-shared/formly/components/field-tooltip/field-tooltip.component';
import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';

import { TooltipWrapperComponent } from './tooltip-wrapper.component';

describe('Tooltip Wrapper Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'example', component: FormlyTestingExampleComponent }],
          wrappers: [{ name: 'tooltip-wrapper', component: TooltipWrapperComponent }],
        }),
        FormlyTestingComponentsModule,
      ],
      declarations: [MockComponent(FieldTooltipComponent), TooltipWrapperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      model: {
        example: '',
      },
      form: new FormGroup({}),
      fields: [
        {
          key: 'example',
          type: 'example',
          wrappers: ['tooltip-wrapper'],
          templateOptions: {
            tooltip: { text: 'tooltip' },
          },
        },
      ],
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
    expect(element.querySelector('ish-tooltip-wrapper')).toBeTruthy();
  });
});
