import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { RecentlyViewedComponent } from './recently-viewed.component';

describe('Recently Viewed Component', () => {
  let component: RecentlyViewedComponent;
  let fixture: ComponentFixture<RecentlyViewedComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async(() => {
    shoppingFacade = mock(ShoppingFacade);

    TestBed.configureTestingModule({
      declarations: [MockComponent(ProductItemComponent), RecentlyViewedComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyViewedComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render product tiles for recently viewed items', () => {
    when(shoppingFacade.mostRecentlyViewedProducts$).thenReturn(of(['A', 'B', 'C']));
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="product-list-container" data-testing-id="recently-viewed">
        <h2>recentlyViewed.component.heading</h2>
        <div class="product-list row">
          <div class="col-6 col-lg-3 product-list-item">
            <ish-product-item ng-reflect-product-sku="A"></ish-product-item>
          </div>
          <div class="col-6 col-lg-3 product-list-item">
            <ish-product-item ng-reflect-product-sku="B"></ish-product-item>
          </div>
          <div class="col-6 col-lg-3 product-list-item">
            <ish-product-item ng-reflect-product-sku="C"></ish-product-item>
          </div>
        </div>
        <a class="view-all" data-testing-id="view-all" routerlink="/recently">common.view_all.link</a>
      </div>
    `);
  });
});
