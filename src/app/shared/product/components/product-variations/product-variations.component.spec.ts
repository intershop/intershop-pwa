import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ProductVariationsComponent } from './product-variations.component';

describe('Product Variations Component', () => {
  let component: ProductVariationsComponent;
  let fixture: ComponentFixture<ProductVariationsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [ProductVariationsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariationsComponent);
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

    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should initialize form of option groups', () => {
    expect(component.form).toBeTruthy();
  });

  it('should set active values for form', () => {
    expect(component.form.value).toEqual({
      variations: {
        a1: 'B',
        a2: 'D',
      },
    });
  });

  it('should throw event when form values change', done => {
    component.selectVariation.subscribe(selection => {
      expect(selection).toEqual({
        a1: 'A',
        a2: 'D',
      });
      done();
    });

    component.form.get('variations').patchValue({ a1: 'A' });
  });
});
