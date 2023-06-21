import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockPipe } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductQuantityLabelComponent } from 'ish-shared/components/product/product-quantity-label/product-quantity-label.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductVariationSelectComponent } from 'ish-shared/components/product/product-variation-select/product-variation-select.component';

import { LineItemEditDialogComponent } from './line-item-edit-dialog.component';

describe('Line Item Edit Dialog Component', () => {
  let component: LineItemEditDialogComponent;
  let fixture: ComponentFixture<LineItemEditDialogComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);

    await TestBed.configureTestingModule({
      declarations: [
        LineItemEditDialogComponent,
        MockComponent(LoadingComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImageComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductQuantityLabelComponent),
        MockComponent(ProductVariationSelectComponent),
        MockPipe(PricePipe),
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(context.select('product')).thenReturn(
      of({
        type: 'VariationProduct',
        sku: 'SKU',
        variableVariationAttributes: [],
        available: true,
        completenessLevel: ProductCompletenessLevel.List,
      } as ProductView)
    );
    when(context.select('prices')).thenReturn(EMPTY);

    when(context.select('loading')).thenReturn(of(false));
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
    expect(findAllCustomElements(element)).toIncludeAllMembers(['ish-product-quantity', 'ish-product-image']);
  });

  it('should display loading-components on the container', () => {
    when(context.select('loading')).thenReturn(of(true));
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toIncludeAllMembers(['ish-product-quantity', 'ish-loading']);
  });
});
