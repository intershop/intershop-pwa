import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductLinksListComponent } from './product-links-list.component';

describe('Product Links List Component', () => {
  let component: ProductLinksListComponent;
  let fixture: ComponentFixture<ProductLinksListComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(ProductItemComponent),
        MockDirective(ProductContextDirective),
        ProductLinksListComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const productLink = { products: ['sku'], categories: ['catID'] } as ProductLinks;

    fixture = TestBed.createComponent(ProductLinksListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.links = productLink;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <div class="product-list-container">
        <h2></h2>
        <div class="product-list">
          <div class="product-list-item list-view">
            <ish-product-item
              displaytype="row"
              ishproductcontext=""
              ng-reflect-display-type="row"
              ng-reflect-sku="sku"
            ></ish-product-item>
          </div>
        </div>
      </div>
    `);
  });
});
