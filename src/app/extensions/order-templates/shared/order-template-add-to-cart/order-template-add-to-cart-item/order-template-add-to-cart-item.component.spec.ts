import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockModule } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductInventory } from 'ish-core/models/product-inventory/product-inventory.model';
import { SharedModule } from 'ish-shared/shared.module';

import { OrderTemplateAddToCartItemComponent } from './order-template-add-to-cart-item.component';

describe('Order Template Add To Cart Item Component', () => {
  let component: OrderTemplateAddToCartItemComponent;
  let fixture: ComponentFixture<OrderTemplateAddToCartItemComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let inventory$: BehaviorSubject<ProductInventory>;

  let holdCallback: (value: boolean) => void;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    inventory$ = new BehaviorSubject<ProductInventory>({ inStock: true } as ProductInventory);

    when(context.select('inventory' as never)).thenReturn(inventory$ as never);
    when(context.connect('propagateActive' as never, anything() as never)).thenReturn();
    when(context.hold(anything() as never, anything() as never)).thenCall((_obs: unknown, cb: (v: boolean) => void) => {
      holdCallback = cb;
    });

    await TestBed.configureTestingModule({
      imports: [OrderTemplateAddToCartItemComponent, TranslateModule.forRoot()],
    })
      .overrideComponent(OrderTemplateAddToCartItemComponent, {
        set: {
          imports: [MockModule(SharedModule)],
          providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTemplateAddToCartItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentOrderTemplate', {
      id: '1',
      title: 'Test Template',
      items: [{ sku: 'SKU1', id: '1', creationDate: 0, desiredQuantity: { value: 2 } }],
    });
    fixture.componentRef.setInput('orderTemplateItemData', {
      sku: 'SKU1',
      id: '1',
      creationDate: 0,
      desiredQuantity: { value: 2 },
    });
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should enable checkbox when product is in stock', () => {
    fixture.detectChanges();
    holdCallback(true);

    expect(component.checkBox.enabled).toBeTrue();
    expect(component.checkBox.value).toBeTrue();
  });

  it('should disable checkbox when product is not in stock', () => {
    fixture.detectChanges();
    holdCallback(false);

    expect(component.checkBox.disabled).toBeTrue();
    expect(component.checkBox.value).toBeFalse();
  });

  it('should render product checkbox', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="productCheckbox"]')).toBeTruthy();
  });

  it('should render product details', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-product-name')).toBeTruthy();
    expect(element.querySelector('ish-product-id')).toBeTruthy();
    expect(element.querySelector('ish-product-quantity')).toBeTruthy();
  });
});
