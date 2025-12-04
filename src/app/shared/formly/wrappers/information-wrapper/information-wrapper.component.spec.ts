import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';

import { InformationWrapperComponent } from './information-wrapper.component';

const fieldBase = {
  key: 'example',
  type: 'example',
  wrappers: ['information'],
};

describe('Information Wrapper Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'example', component: FormlyTestingExampleComponent }],
          wrappers: [{ name: 'information', component: InformationWrapperComponent }],
        }),
        FormlyTestingComponentsModule,
        InformationWrapperComponent,
      ],
    })
      .overrideComponent(InformationWrapperComponent, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockPipe(TranslatePipe, (value, args) => `value:${value} args:${JSON.stringify(args)}`)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.form = new FormGroup({});
    component.model = {};
    component.fields = [
      {
        ...fieldBase,
        props: {
          customInformation: 'info',
        },
      },
    ];
  });

  it('should be created', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('ish-information-wrapper')).toBeTruthy();
  });

  it('should contain basic string information for no arguments', () => {
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id=custom-information]').textContent).toMatchInlineSnapshot(
      `" value:info args:{} "`
    );
  });

  it('should contain complex information when arguments are supplied', () => {
    component.fields = [
      {
        ...fieldBase,
        props: {
          customInformation: {
            key: 'information',
            args: {
              0: 'argument',
            },
          },
        },
      },
    ];
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=custom-information]').textContent).toMatchInlineSnapshot(
      `" value:information args:{"0":"argument"} "`
    );
  });

  it('should apply custom class when supplied', () => {
    component.fields = [
      {
        ...fieldBase,
        props: {
          customInformation: {
            key: 'information',
            class: 'custom-class',
          },
        },
      },
    ];
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=custom-information]')).toBeTruthy();
  });

  it('should not display the information text when customInformation is not provided', () => {
    component.fields = [
      {
        ...fieldBase,
        props: {},
      },
    ];
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id=custom-information]')).toBeFalsy();
  });
});
