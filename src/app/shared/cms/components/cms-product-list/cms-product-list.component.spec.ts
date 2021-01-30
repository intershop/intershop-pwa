import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { CMSProductListComponent } from './cms-product-list.component';

describe('Cms Product List Component', () => {
  let component: CMSProductListComponent;
  let fixture: ComponentFixture<CMSProductListComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CMSProductListComponent,
        MockComponent(ProductItemComponent),
        MockDirective(ProductContextDirective),
      ],
    }).compileComponents();
  });

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
            <ish-product-item
              displaytype="tile"
              ishproductcontext=""
              ng-reflect-display-type="tile"
              ng-reflect-sku="1"
            ></ish-product-item>
          </div>
          <div class="product-list-item li-css-class" ng-reflect-ng-class="li-css-class">
            <ish-product-item
              displaytype="tile"
              ishproductcontext=""
              ng-reflect-display-type="tile"
              ng-reflect-sku="2"
            ></ish-product-item>
          </div>
        </div>
      </div>
    `);
  });
});
