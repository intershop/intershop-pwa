import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';

import { PricePipe } from 'ish-core/models/price/price.pipe';
import { createProductView } from 'ish-core/models/product-view/product-view.model';
import { Product } from 'ish-core/models/product/product.model';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

import { BasketValidationProductsComponent } from './basket-validation-products.component';

describe('Basket Validation Products Component', () => {
  let component: BasketValidationProductsComponent;
  let fixture: ComponentFixture<BasketValidationProductsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasketValidationProductsComponent,
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockPipe(PricePipe),
        MockPipe(ProductRoutePipe),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketValidationProductsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display anything if there are no validation products', () => {
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should display an validation product if there is a validation product', () => {
    component.items = [
      { message: 'validation message', product: createProductView({ sku: '4713' } as Product, categoryTree()) },
    ];

    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="validation-removed-items-message"]').innerHTML).toContain(
      'validation message'
    );
    expect(element.querySelector('.list-header')).toBeTruthy();
    expect(element.querySelector('.list-body')).toBeTruthy();
    expect(element.querySelector('.product-id').innerHTML).toContain('4713');
  });
});
