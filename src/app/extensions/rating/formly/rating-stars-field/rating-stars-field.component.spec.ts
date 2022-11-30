import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

import { ProductRatingStarComponent } from '../../shared/product-rating-star/product-rating-star.component';

import { RatingStarsFieldComponent } from './rating-stars-field.component';

describe('Rating Stars Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-rating-stars-field',
              component: RatingStarsFieldComponent,
            },
          ],
        }),
        FormlyTestingComponentsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [MockComponent(ProductRatingStarComponent), RatingStarsFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          key: 'input',
          type: 'ish-rating-stars-field',
          templateOptions: {
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

    expect(element.querySelectorAll('a')).toHaveLength(5);

    element.querySelectorAll('a').forEach((el, key) => {
      el.click();
      expect(component.form.get('input').value).toEqual(key + 1);
    });
  });
});
