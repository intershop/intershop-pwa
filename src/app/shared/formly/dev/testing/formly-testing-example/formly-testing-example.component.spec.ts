import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { FormlyTestingExampleComponent } from './formly-testing-example.component';

describe('Formly Testing Example Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [{ name: 'example', component: FormlyTestingExampleComponent }],
        }),
        ReactiveFormsModule,
      ],
      declarations: [FormlyTestingContainerComponent, FormlyTestingExampleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          key: 'example',
          type: 'example',
        },
      ],
      model: {
        example: '',
      },
      form: new FormGroup({}),
    };
    fixture = TestBed.createComponent(FormlyTestingContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.testComponentInputs = testComponentInputs;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('ish-formly-testing-example')).toBeTruthy();
  });
});
