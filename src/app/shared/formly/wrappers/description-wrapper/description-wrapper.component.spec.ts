import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { FormlyTestingExampleComponent } from 'ish-shared/formly/dev/testing/formly-testing-example/formly-testing-example.component';

import { DescriptionWrapperComponent } from './description-wrapper.component';

const fieldBase = {
  key: 'example',
  type: 'example',
  wrappers: ['description'],
};

describe('Description Wrapper Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'example', component: FormlyTestingExampleComponent }],
          wrappers: [{ name: 'description', component: DescriptionWrapperComponent }],
        }),
        FormlyTestingComponentsModule,
      ],
      declarations: [
        DescriptionWrapperComponent,
        MockPipe(TranslatePipe, (value, args) => `value:${value} args:${JSON.stringify(args)}`),
      ],
    }).compileComponents();
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
          customDescription: 'desc',
        },
      },
    ];
  });

  it('should be created', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('ish-description-wrapper')).toBeTruthy();
  });

  it('should contain basic string description for no arguments', () => {
    fixture.detectChanges();

    expect(element.querySelector('small').textContent).toMatchInlineSnapshot(`
      " value:desc args:{}
      "
    `);
  });

  it('should contain complex description when arguments are supplied', () => {
    component.fields = [
      {
        ...fieldBase,
        props: {
          customDescription: {
            key: 'description',
            args: {
              0: 'argument',
            },
          },
        },
      },
    ];
    fixture.detectChanges();
    expect(element.querySelector('small').textContent).toMatchInlineSnapshot(`
      " value:description args:{"0":"argument"}
      "
    `);
  });
});
