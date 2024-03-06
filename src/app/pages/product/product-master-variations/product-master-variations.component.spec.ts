import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { FilterNavigationComponent } from 'ish-shared/components/filter/filter-navigation/filter-navigation.component';
import { ProductListingComponent } from 'ish-shared/components/product/product-listing/product-listing.component';

import { ProductMasterVariationsComponent } from './product-master-variations.component';

describe('Product Master Variations Component', () => {
  let component: ProductMasterVariationsComponent;
  let fixture: ComponentFixture<ProductMasterVariationsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const context = mock(ProductContextFacade);
    when(context.select('product', 'sku')).thenReturn(of('123456789'));
    when(context.select('product')).thenReturn(
      of({ type: 'VariationProductMaster', variations: [{ sku: '123456789-01' }] } as ProductView)
    );

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FilterNavigationComponent),
        MockComponent(ProductListingComponent),
        ProductMasterVariationsComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMasterVariationsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <a id="variation-list-top" title="top"></a
      ><ish-filter-navigation
        orientation="horizontal"
        fragmentonrouting="variation-list-top"
        ng-reflect-orientation="horizontal"
        ng-reflect-fragment-on-routing="variation-list-top"
      ></ish-filter-navigation
      ><ish-product-listing
        mode="paging"
        fragmentonrouting="variation-list-top"
        ng-reflect-mode="paging"
        ng-reflect-fragment-on-routing="variation-list-top"
      ></ish-product-listing>
    `);
  });

  it('should set the correct id for the underlying product list', () => {
    fixture.detectChanges();
    const productList = fixture.debugElement.query(By.css('ish-product-listing'))
      .componentInstance as ProductListingComponent;

    expect(productList.productListingId).toMatchInlineSnapshot(`
      {
        "type": "master",
        "value": "123456789",
      }
    `);
  });
});
