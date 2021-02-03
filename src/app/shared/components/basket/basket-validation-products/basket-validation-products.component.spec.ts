import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';
import { ProductNameComponent } from 'ish-shell/header/product-name/product-name.component';

import { BasketValidationProductsComponent } from './basket-validation-products.component';

describe('Basket Validation Products Component', () => {
  let component: BasketValidationProductsComponent;
  let fixture: ComponentFixture<BasketValidationProductsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.product$(anything(), anything())).thenCall(sku => of({ sku }));

    await TestBed.configureTestingModule({
      declarations: [
        BasketValidationProductsComponent,
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductNameComponent),
        MockDirective(ProductContextDirective),
        MockPipe(PricePipe),
        MockPipe(ProductRoutePipe),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
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
    component.items = [{ message: 'validation message', productSKU: '4713' }];

    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="validation-removed-items-message"]').innerHTML).toContain(
      'validation message'
    );
    expect(element.querySelector('.list-header')).toBeTruthy();
    expect(element.querySelector('.list-body')).toBeTruthy();
    expect(element.querySelector('.product-id').innerHTML).toContain('4713');
  });
});
