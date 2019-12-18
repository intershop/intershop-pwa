import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ProductLinkView } from 'ish-core/models/product-links/product-links.model';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductLinksListComponent } from './product-links-list.component';

describe('Product Links List Component', () => {
  let component: ProductLinksListComponent;
  let fixture: ComponentFixture<ProductLinksListComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [MockComponent(ProductItemComponent), ProductLinksListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    const productLink = { productSKUs: ['sku'], categoryIds: ['catID'] } as ProductLinkView;

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
            <ish-product-item ng-reflect-product-sku="sku"></ish-product-item>
          </div>
        </div>
      </div>
    `);
  });
});
