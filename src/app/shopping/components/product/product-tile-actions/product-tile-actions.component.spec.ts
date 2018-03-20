import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../../../models/product/product.model';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { ProductTileActionsComponent } from './product-tile-actions.component';

describe('Product Tile Actions Component', () => {
  let component: ProductTileActionsComponent;
  let fixture: ComponentFixture<ProductTileActionsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        ProductTileActionsComponent,
        MockComponent({ selector: 'ish-product-add-to-cart', template: 'Product Add To Cart Component', inputs: ['product', 'quantity'] }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTileActionsComponent);
    component = fixture.componentInstance;
    component.product = { sku: 'sku' } as Product;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
