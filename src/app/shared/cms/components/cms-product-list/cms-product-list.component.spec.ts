import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { CMSProductListComponent } from './cms-product-list.component';

describe('Cms Product List Component', () => {
  let component: CMSProductListComponent;
  let fixture: ComponentFixture<CMSProductListComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CMSProductListComponent, MockComponent(ProductItemComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSProductListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      displayName: 'name',
      domain: 'domain',
      configurationParameters: {
        Products: ['1@Domain', '2@Domain'],
        Title: 'PageletTitle',
        CSSClass: 'css-class',
        ListItemCSSClass: 'li-css-class',
      },
    };
    component.pagelet = createContentPageletView(pagelet);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
      <div class="product-list-container css-class" ng-reflect-ng-class="css-class">
        <h2>PageletTitle</h2>
        <div class="product-list row">
          <div class="product-list-item li-css-class" ng-reflect-ng-class="li-css-class">
            <ish-product-item ng-reflect-product-sku="1"></ish-product-item>
          </div>
          <div class="product-list-item li-css-class" ng-reflect-ng-class="li-css-class">
            <ish-product-item ng-reflect-product-sku="2"></ish-product-item>
          </div>
        </div>
      </div>
    `);
  });
});
