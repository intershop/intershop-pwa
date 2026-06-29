import { AsyncPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective, MockInstance } from 'ng-mocks';
import { forkJoin, of, switchMap } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { LazyLoadingContentDirective } from 'ish-core/directives/lazy-loading-content.directive';
import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductInventory } from 'ish-core/models/product-inventory/product-inventory.model';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { DeferredItemComponent } from 'ish-shared/components/common/deferred-item/deferred-item.component';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductLinksCarouselComponent } from './product-links-carousel.component';

describe('Product Links Carousel Component', () => {
  let component: ProductLinksCarouselComponent;
  let fixture: ComponentFixture<ProductLinksCarouselComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  MockInstance.scope();

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      imports: [ProductLinksCarouselComponent],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    })
      .overrideComponent(ProductLinksCarouselComponent, {
        remove: {
          imports: [DeferredItemComponent, LazyLoadingContentDirective, ProductContextDirective, ProductItemComponent],
        },
        add: {
          imports: [
            AsyncPipe,
            MockDirective(ProductContextDirective),
            MockComponent(ProductItemComponent),
            MockComponent(DeferredItemComponent),
            MockDirective(LazyLoadingContentDirective),
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    const productLink = { products: ['sku1', 'sku2', 'sku3'], categories: ['catID'] } as ProductLinks;

    fixture = TestBed.createComponent(ProductLinksCarouselComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.links = productLink;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('.swiper')).toBeTruthy();
  });

  it('should render product items directly for server-side rendering', () => {
    component.isServerSideRendering = true;

    fixture.detectChanges();

    expect(element.querySelector('swiper')).toBeFalsy();
    expect(element.querySelectorAll('ish-product-item')).toHaveLength(3);
    expect(element.querySelector('.product-list-item').classList.contains('col-lg-3')).toBeTrue();
  });

  it('should render all product slides if stocks filtering is off', done => {
    component.displayOnlyAvailableProducts = false;

    component.productSKUs$.pipe(switchMap(products$ => forkJoin(products$))).subscribe(products => {
      expect(products).toHaveLength(3);
      done();
    });
  });

  it('should render only available product slides if stocks filtering is on', done => {
    when(shoppingFacade.product$(anything(), anything())).thenCall(sku => of({ sku } as ProductView));
    when(shoppingFacade.productInventory$(anything())).thenCall(sku =>
      of({ sku, inStock: sku !== 'sku2' } as ProductInventory)
    );

    component.displayOnlyAvailableProducts = true;

    component.productSKUs$.pipe(switchMap(products$ => forkJoin(products$))).subscribe(products => {
      expect(products).toHaveLength(2);
      done();
    });
  });
});
