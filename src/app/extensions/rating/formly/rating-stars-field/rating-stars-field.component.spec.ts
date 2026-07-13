import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbModule, NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';

import { FormlyTestingComponentsModule } from 'ish-shared/formly/dev/testing/formly-testing-components.module';
import { FormlyTestingContainerComponent } from 'ish-shared/formly/dev/testing/formly-testing-container/formly-testing-container.component';

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
        NgbModule,
        TranslatePipe,
      ],
      declarations: [RatingStarsFieldComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
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

    expect(element.querySelectorAll('.bi')).toHaveLength(5);
  });

  it('should update the form value on rate change', () => {
    fixture.detectChanges();

    const ngbRatingDirective = fixture.debugElement.query(By.directive(NgbRating));
    for (let i = 1; i <= 5; i++) {
      ngbRatingDirective.triggerEventHandler('rateChange', i);
      fixture.detectChanges();
      expect(component.form.get('input').value).toEqual(i);
    }
  });

  it('should initialize an empty rating with 0 so it can be changed via the keyboard', () => {
    fixture.detectChanges();

    const ngbRating = fixture.debugElement.query(By.directive(NgbRating)).componentInstance as NgbRating;
    // regression: an empty form value must not initialize the rating with NaN, otherwise arrow keys do nothing
    expect(ngbRating.rate).toBe(0);

    ngbRating.handleKeyDown({ key: 'ArrowRight', preventDefault: jest.fn() } as unknown as KeyboardEvent);

    expect(ngbRating.rate).toBe(1);
  });

  it('should reflect initial form value', () => {
    component.testComponentInputs = {
      fields: [
        {
          key: 'input',
          type: 'ish-rating-stars-field',
          props: { label: 'test label', required: true },
        } as FormlyFieldConfig,
      ],
      form: new FormGroup({}),
      model: { input: 3 },
    };
    fixture.detectChanges();

    expect(element.querySelectorAll('.bi-star-fill')).toHaveLength(3);
  });
});
