import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Product } from 'ish-core/models/product/product.model';

import { ProductBundleDisplayComponent } from './product-bundle-display.component';

describe('Product Bundle Display Component', () => {
  let component: ProductBundleDisplayComponent;
  let fixture: ComponentFixture<ProductBundleDisplayComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async(() => {
    shoppingFacade = mock(ShoppingFacade);

    TestBed.configureTestingModule({
      declarations: [ProductBundleDisplayComponent],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBundleDisplayComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render product bundle parts when supplied', () => {
    when(shoppingFacade.productBundleParts$('sku')).thenReturn(
      of([
        { product: { sku: 'ABC', name: 'abc' } as Product, quantity: 3 },
        { product: { sku: 'DEF', name: 'def' } as Product, quantity: 2 },
      ])
    );
    component.productBundleSKU = 'sku';

    component.ngOnChanges();
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <ul>
        <li>3 x abc</li>
        <li>2 x def</li>
      </ul>
    `);
  });
});
