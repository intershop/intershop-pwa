import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anyNumber, instance, mock, when } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';

import { CMSProductListFilterComponent } from './cms-product-list-filter.component';

describe('Cms Product List Filter Component', () => {
  let component: CMSProductListFilterComponent;
  let fixture: ComponentFixture<CMSProductListFilterComponent>;
  let element: HTMLElement;
  let cmsFacade: CMSFacade;
  let shoppingFacade: ShoppingFacade;
  let pagelet: ContentPagelet;

  beforeEach(async () => {
    cmsFacade = mock(CMSFacade);
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [CMSProductListFilterComponent],
      providers: [
        { provide: CMSFacade, useFactory: () => instance(cmsFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSProductListFilterComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      displayName: 'name',
      domain: 'domain',
      configurationParameters: {
        ListStyle: 'Carousel',
        MaxNumberOfProducts: 6,
        ShowViewAll: 'true',
        SlideItems: 4,
        Scope: 'GlobalScope',
        Filter: 'top_seller_products',
        ListItemStyle: 'tile',
        Title: 'Filter Products Pagelet',
        CSSClass: 'container',
        ListItemCSSClass: 'col-12 col-sm-6 col-lg-3',
      },
    };
    component.pagelet = createContentPageletView(pagelet);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('getProductSKUs$', () => {
    beforeEach(() => {
      when(
        cmsFacade.parameterProductListFilter$('categoryId', 'top_seller_products', 'GlobalScope', anyNumber())
      ).thenReturn(of(['id-1', 'id-2', 'id-3']));
      when(shoppingFacade.selectedCategoryId$).thenReturn(of('categoryId'));
    });

    it('should get all available products for given product filter', done => {
      component.pagelet = createContentPageletView({
        ...pagelet,
        configurationParameters: {
          ...pagelet.configurationParameters,
          MaxNumberOfProducts: 6,
        },
      });

      component.ngOnChanges();

      component.productSKUs$.subscribe(productSKUs => {
        expect(productSKUs).toHaveLength(3);
        expect(productSKUs).toMatchInlineSnapshot(`
          Array [
            "id-1",
            "id-2",
            "id-3",
          ]
        `);
        done();
      });
    });
  });
});
