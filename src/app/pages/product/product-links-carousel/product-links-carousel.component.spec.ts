import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { forkJoin, of, switchMap } from 'rxjs';
import { SwiperComponent } from 'swiper/angular';
import { anything, instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductInventory } from 'ish-core/models/product-inventory/product-inventory.model';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { ProductLinksCarouselComponent } from './product-links-carousel.component';

describe('Product Links Carousel Component', () => {
  let component: ProductLinksCarouselComponent;
  let fixture: ComponentFixture<ProductLinksCarouselComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [MockComponent(SwiperComponent), ProductLinksCarouselComponent],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
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
    expect(element.querySelector('swiper')).toBeTruthy();
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
