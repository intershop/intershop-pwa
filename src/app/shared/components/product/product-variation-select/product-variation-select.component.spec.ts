import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { VariationProduct, VariationProductMaster } from 'ish-core/models/product/product.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ProductVariationSelectDefaultComponent } from 'ish-shared/components/product/product-variation-select-default/product-variation-select-default.component';
import { ProductVariationSelectEnhancedComponent } from 'ish-shared/components/product/product-variation-select-enhanced/product-variation-select-enhanced.component';
import { ProductVariationSelectSwatchComponent } from 'ish-shared/components/product/product-variation-select-swatch/product-variation-select-swatch.component';

import { ProductVariationSelectComponent } from './product-variation-select.component';

describe('Product Variation Select Component', () => {
  let component: ProductVariationSelectComponent;
  let fixture: ComponentFixture<ProductVariationSelectComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  const productMaster = {
    variationAttributeValues: [
      { variationAttributeId: 'a1', value: 'A', attributeType: 'colorCode' },
      { variationAttributeId: 'a1', value: 'B', attributeType: 'colorCode' },
      { variationAttributeId: 'a2', value: 'C', attributeType: 'defaultAndColorCode' },
      { variationAttributeId: 'a2', value: 'D', attributeType: 'defaultAndColorCode' },
      { variationAttributeId: 'a3', value: 'E', attributeType: 'swatchImage' },
      { variationAttributeId: 'a3', value: 'F', attributeType: 'swatchImage' },
      { variationAttributeId: 'a4', value: 'G', attributeType: 'defaultAndSwatchImage' },
      { variationAttributeId: 'a4', value: 'H', attributeType: 'defaultAndSwatchImage' },
      { variationAttributeId: 'a5', value: 'I', attributeType: 'default' },
      { variationAttributeId: 'a5', value: 'J', attributeType: 'default' },
    ],
  } as VariationProductMaster;

  const variationProduct = {
    variableVariationAttributes: [
      { variationAttributeId: 'a1', value: 'B', attributeType: 'colorCode' },
      { variationAttributeId: 'a2', value: 'D', attributeType: 'defaultAndColorCode' },
      { variationAttributeId: 'a3', value: 'F', attributeType: 'swatchImage' },
      { variationAttributeId: 'a4', value: 'H', attributeType: 'defaultAndSwatchImage' },
      { variationAttributeId: 'a5', value: 'J', attributeType: 'default' },
    ],
  } as VariationProduct;

  const variationProductView = {
    ...variationProduct,
    variations: [variationProduct],
    productMaster,
  } as ProductView;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(ProductVariationSelectDefaultComponent),
        MockComponent(ProductVariationSelectEnhancedComponent),
        MockComponent(ProductVariationSelectSwatchComponent),
        ProductVariationSelectComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariationSelectComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(context.select('product')).thenReturn(of(variationProductView));
    when(context.select('displayProperties', 'variations')).thenReturn(of(true));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render the different attribute types with the fitting product variation select components', () => {
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-product-variation-select-swatch",
        "ish-product-variation-select-enhanced",
        "ish-product-variation-select-swatch",
        "ish-product-variation-select-enhanced",
        "ish-product-variation-select-default",
      ]
    `);
  });

  it('should trigger a contex value change if value changes', () => {
    fixture.detectChanges();

    component.optionChange({ group: 'a2', value: 'C' });

    verify(context.changeVariationOption(anything(), anything())).once();
    expect(capture(context.changeVariationOption).last()).toMatchInlineSnapshot(`
      Array [
        "a2",
        "C",
      ]
    `);
  });
});
