import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';

import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductListComponent } from './product-list.component';

describe('Product List Component', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(ProductItemComponent), ProductListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.products = ['sku'];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a product tile when viewType is grid', () => {
    component.viewType = 'grid';
    fixture.detectChanges();
    const productItemContainer = fixture.debugElement.query(By.css('ish-product-item'))
      .componentInstance as ProductItemComponent;
    expect(productItemContainer.configuration.displayType).toEqual('tile');
  });

  it('should render a product row when viewType is list', () => {
    component.viewType = 'list';
    fixture.detectChanges();
    const productItemContainer = fixture.debugElement.query(By.css('ish-product-item'))
      .componentInstance as ProductItemComponent;
    expect(productItemContainer.configuration.displayType).toEqual('row');
  });
});
