import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anyNumber, anyString, instance, mock, when } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';

import { CMSProductListCategoryComponent } from './cms-product-list-category.component';

describe('Cms Product List Category Component', () => {
  let component: CMSProductListCategoryComponent;
  let fixture: ComponentFixture<CMSProductListCategoryComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;
  let cmsFacade: CMSFacade;
  let pagelet: ContentPagelet;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    cmsFacade = mock(CMSFacade);
    await TestBed.configureTestingModule({
      declarations: [CMSProductListCategoryComponent],
      providers: [
        { provide: CMSFacade, useFactory: () => instance(cmsFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSProductListCategoryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  beforeEach(() => {
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
        Category: 'categoryId',
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

  describe('MaxNumberOfProducts', () => {
    beforeEach(() => {
      when(shoppingFacade.categoryIdByRefId$(anyString())).thenReturn(of('categoryId'));
      when(cmsFacade.parameterProductListFilter$('categoryId', undefined, undefined, anyNumber())).thenReturn(
        of(['id-1', 'id-2', 'id-3'])
      );
    });

    it('should get all available products, when MaxNumberOfProducts is set', done => {
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

  describe('categoryId', () => {
    it('should not get product list when categoryId could not be found', done => {
      when(shoppingFacade.categoryIdByRefId$(anyString())).thenReturn(of(undefined));

      component.ngOnChanges();

      let count = 0;
      component.productSKUs$.subscribe({
        next: () => {
          count++;
          done();
        },
        error: done(),
      });

      expect(count).toEqual(0);
    });
  });
});
