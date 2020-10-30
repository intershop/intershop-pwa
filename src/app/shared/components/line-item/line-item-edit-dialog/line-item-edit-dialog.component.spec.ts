import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductVariationSelectComponent } from 'ish-shared/components/product/product-variation-select/product-variation-select.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { ProductImageComponent } from 'ish-shell/header/product-image/product-image.component';

import { LineItemEditDialogComponent } from './line-item-edit-dialog.component';

describe('Line Item Edit Dialog Component', () => {
  let component: LineItemEditDialogComponent;
  let fixture: ComponentFixture<LineItemEditDialogComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [
        LineItemEditDialogComponent,
        MockComponent(InputComponent),
        MockComponent(LoadingComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductVariationSelectComponent),
        MockPipe(PricePipe),
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.lineItem = ({
      quantity: {
        value: 5,
      },
    } as unknown) as LineItemView;

    when(shoppingFacade.product$(anything(), anything())).thenReturn(
      of({
        type: 'VariationProduct',
        sku: 'SKU',
        variableVariationAttributes: [],
        availability: true,
        inStock: true,
        completenessLevel: ProductCompletenessLevel.List,
      } as VariationProductView)
    );

    when(shoppingFacade.productNotReady$(anything(), anything())).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should give correct product id of variation to product id component', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-product-id')).toMatchInlineSnapshot(`<ish-product-id></ish-product-id>`);
  });

  it('should display ish-components on the container', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toIncludeAllMembers(['ish-input', 'ish-product-image']);
  });

  it('should display loading-components on the container', () => {
    when(shoppingFacade.productNotReady$(anything(), anything())).thenReturn(of(true));
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toIncludeAllMembers(['ish-input', 'ish-loading']);
  });
});
