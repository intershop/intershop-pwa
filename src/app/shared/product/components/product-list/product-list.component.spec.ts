import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { Product } from 'ish-core/models/product/product.model';
import { LoadingComponent } from '../../../../shared/common/components/loading/loading.component';
import { ProductItemContainerComponent } from '../../containers/product-item/product-item.container';

import { ProductListComponent } from './product-list.component';

describe('Product List Component', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InfiniteScrollModule],
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(ProductItemContainerComponent),
        ProductListComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.products = [{ sku: 'sku' } as Product];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a product tile when viewType is grid', () => {
    component.viewType = 'grid';
    fixture.detectChanges();
    const productItemContainer = fixture.debugElement.query(By.css('ish-product-item-container'))
      .componentInstance as ProductItemContainerComponent;
    expect(productItemContainer.configuration.displayType).toEqual('tile');
  });

  it('should render a product row when viewType is list', () => {
    component.viewType = 'list';
    fixture.detectChanges();
    const productItemContainer = fixture.debugElement.query(By.css('ish-product-item-container'))
      .componentInstance as ProductItemContainerComponent;
    expect(productItemContainer.configuration.displayType).toEqual('row');
  });
});
