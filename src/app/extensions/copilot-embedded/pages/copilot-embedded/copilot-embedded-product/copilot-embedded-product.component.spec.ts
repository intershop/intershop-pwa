import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductChooseVariationComponent } from 'ish-shared/components/product/product-choose-variation/product-choose-variation.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductItemVariationsComponent } from 'ish-shared/components/product/product-item-variations/product-item-variations.component';
import { ProductLabelComponent } from 'ish-shared/components/product/product-label/product-label.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';

import { CopilotEmbeddedProductComponent } from './copilot-embedded-product.component';

describe('Copilot Embedded Product Component', () => {
  let component: CopilotEmbeddedProductComponent;
  let fixture: ComponentFixture<CopilotEmbeddedProductComponent>;
  let element: HTMLElement;
  let product$: BehaviorSubject<ProductView>;

  beforeEach(async () => {
    product$ = new BehaviorSubject({ sku: 'SKU' } as ProductView);
    const context = mock(ProductContextFacade);
    when(context.select('product')).thenReturn(product$);
    when(context.select('loading')).thenReturn(of(false));

    await TestBed.configureTestingModule({
      imports: [MockComponent(ProductImageComponent)],
      declarations: [
        CopilotEmbeddedProductComponent,
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductChooseVariationComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductItemVariationsComponent),
        MockComponent(ProductLabelComponent),
        MockComponent(ProductNameComponent),
        MockComponent(ProductPriceComponent),
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotEmbeddedProductComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render the compact product row', () => {
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      [
        "ish-product-image",
        "ish-product-label",
        "ish-product-name",
        "ish-product-id",
        "ish-product-price",
        "ish-product-item-variations",
        "ish-product-add-to-basket",
        "ish-product-choose-variation",
      ]
    `);
  });

  it('should not render a product that failed to load', () => {
    product$.next({ sku: 'SKU', failed: true } as ProductView);
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toBeEmpty();
  });
});
