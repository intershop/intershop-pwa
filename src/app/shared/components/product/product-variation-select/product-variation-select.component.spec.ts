import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ProductVariationSelectComponent } from './product-variation-select.component';

describe('Product Variation Select Component', () => {
  let component: ProductVariationSelectComponent;
  let fixture: ComponentFixture<ProductVariationSelectComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [ProductVariationSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariationSelectComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.variationOptions = [
      {
        id: 'a1',
        label: 'Attr 1',
        options: [
          {
            label: 'A',
            value: 'A',
            type: 'a1',
            alternativeCombination: false,
            active: false,
          },
          {
            label: 'B',
            value: 'B',
            type: 'a1',
            alternativeCombination: false,
            active: true,
          },
        ],
      },
      {
        id: 'a2',
        label: 'Attr 2',
        options: [
          {
            label: 'C',
            value: 'C',
            type: 'a2',
            alternativeCombination: true,
            active: false,
          },
          {
            label: 'D',
            value: 'D',
            type: 'a2',
            alternativeCombination: false,
            active: true,
          },
        ],
      },
    ];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should initialize form of option groups', () => {
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.form).toBeTruthy();
  });

  it('should set active values for form', () => {
    component.ngOnChanges();
    fixture.detectChanges();

    expect(component.form.value).toEqual({
      a1: 'B',
      a2: 'D',
    });
  });

  it('should throw event when form values change', done => {
    component.ngOnChanges();
    fixture.detectChanges();

    component.selectVariation.subscribe(selection => {
      expect(selection).toEqual({
        changedAttribute: 'a1',
        selection: {
          a1: 'A',
          a2: 'D',
        },
      });
      done();
    });

    component.form.patchValue({ a1: 'A' });
  });

  it('should apply value changes after data changed', () => {
    component.variationOptions[0].options[1].value = 'BBB';
    component.ngOnChanges();

    expect(component.form.value).toEqual({
      a1: 'BBB',
      a2: 'D',
    });
  });
});
