import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { VariationProduct, VariationProductMaster } from 'ish-core/models/product/product.model';
import { findAllDataTestingIDs } from 'ish-core/utils/dev/html-query-utils';

import { ProductVariationSelectComponent } from './product-variation-select.component';

describe('Product Variation Select Component', () => {
  let component: ProductVariationSelectComponent;
  let fixture: ComponentFixture<ProductVariationSelectComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  const productMaster = {
    variationAttributeValues: [
      { variationAttributeId: 'a1', value: 'A' },
      { variationAttributeId: 'a1', value: 'B' },
      { variationAttributeId: 'a2', value: 'C' },
      { variationAttributeId: 'a2', value: 'D' },
    ],
  } as VariationProductMaster;

  const variationProduct = {
    variableVariationAttributes: [
      { variationAttributeId: 'a1', value: 'B' },
      { variationAttributeId: 'a2', value: 'D' },
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
      imports: [TranslateModule.forRoot()],
      declarations: [ProductVariationSelectComponent],
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

  it('should initialize form of option groups', () => {
    fixture.detectChanges();

    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      Array [
        "a1",
        "a1-A",
        "a1-B",
        "a2",
        "a2-C",
        "a2-D",
      ]
    `);
  });

  it('should set active values for form', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('select[data-testing-id=a1]')).nativeElement.value).toMatchInlineSnapshot(
      `"B"`
    );

    expect(fixture.debugElement.query(By.css('select[data-testing-id=a2]')).nativeElement.value).toMatchInlineSnapshot(
      `"D"`
    );
  });

  it('should trigger value change if value changes', () => {
    fixture.detectChanges();

    const select = fixture.debugElement.query(By.css('select')).nativeElement;
    select.value = 'A';
    select.dispatchEvent(new Event('change'));

    verify(context.changeVariationOption(anything(), anything())).once();
    expect(capture(context.changeVariationOption).last()).toMatchInlineSnapshot(`
      Array [
        "a1",
        "A",
      ]
    `);
  });
});
