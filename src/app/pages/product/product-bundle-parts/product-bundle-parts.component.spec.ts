import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductBundlePartsComponent } from './product-bundle-parts.component';

describe('Product Bundle Parts Component', () => {
  let component: ProductBundlePartsComponent;
  let fixture: ComponentFixture<ProductBundlePartsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'bundleParts')).thenReturn(of(true));
    when(context.select('parts')).thenReturn(
      of([
        { sku: '1', quantity: 3 },
        { sku: '2', quantity: 1 },
      ])
    );

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductItemComponent),
        MockDirective(ProductContextDirective),
        ProductBundlePartsComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBundlePartsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-product-item",
        "ish-product-item",
        "ish-product-add-to-basket",
      ]
    `);
  });
});
