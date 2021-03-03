import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';

import { BasketValidationProductsComponent } from './basket-validation-products.component';

describe('Basket Validation Products Component', () => {
  let component: BasketValidationProductsComponent;
  let fixture: ComponentFixture<BasketValidationProductsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BasketValidationProductsComponent,
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductNameComponent),
        MockDirective(ProductContextDirective),
        MockPipe(PricePipe),
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

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
    component.items = [{ message: 'validation message', productSKU: '4713', price: {} as PriceItem }];

    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="validation-removed-items-message"]').innerHTML).toContain(
      'validation message'
    );
    expect(element.querySelector('.list-header')).toBeTruthy();
    expect(element.querySelector('.list-body')).toBeTruthy();
  });
});
