import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';
import { formlyTestingImports } from 'ish-shared/formly/dev/testing/formly-testing.imports';

import { ProductRatingStarComponent } from '../../shared/product-rating-star/product-rating-star.component';

import { RatingStarsFieldComponent } from './rating-stars-field.component';

describe('Rating Stars Field Component', () => {
  let component: FormlyTestingContainerComponent;
  let fixture: ComponentFixture<FormlyTestingContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideTranslateService()],
      imports: [
        ...formlyTestingImports,
        FormlyModule.forRoot({
          types: [
            {
              name: 'ish-rating-stars-field',
              component: RatingStarsFieldComponent,
            },
          ],
        }),
        RatingStarsFieldComponent,
      ],
    })
      .overrideComponent(RatingStarsFieldComponent, {
        remove: { imports: [ProductRatingStarComponent] },
        add: { imports: [MockComponent(ProductRatingStarComponent)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    const testComponentInputs = {
      fields: [
        {
          key: 'input',
          type: 'ish-rating-stars-field',
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

    expect(element.querySelectorAll('button')).toHaveLength(5);

    element.querySelectorAll('button').forEach((el, key) => {
      el.click();
      expect(component.form.get('input').value).toEqual(key + 1);
    });
  });
});
