import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { Recommendations } from 'ish-core/models/recommendations/recommendations.model';

import { CMSProductListRecommendationsComponent } from './cms-product-list-recommendations.component';

describe('Cms Product List Recommendations Component', () => {
  let component: CMSProductListRecommendationsComponent;
  let fixture: ComponentFixture<CMSProductListRecommendationsComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  const createComponent = () => {
    fixture = TestBed.createComponent(CMSProductListRecommendationsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  };

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [CMSProductListRecommendationsComponent],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    // Default mock setup
    when(shoppingFacade.productRecommendations$(anything())).thenReturn(
      of({
        strategy: 'similar_products',
        productSKUs: ['rec1', 'rec2', 'rec3'],
      })
    );

    createComponent();
  });

  it('should be created', () => {
    const pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      displayName: 'name',
      domain: 'domain',
      configurationParameters: {},
    };
    component.pagelet = createContentPageletView(pagelet);

    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('ngOnChanges', () => {
    it('should load recommendations with strategy from pagelet configuration', () => {
      const pagelet = {
        definitionQualifiedName: 'fq',
        id: 'id',
        displayName: 'name',
        domain: 'domain',
        configurationParameters: {
          Strategy: 'similar_products',
        },
      };
      component.pagelet = createContentPageletView(pagelet);

      component.ngOnChanges();

      verify(shoppingFacade.productRecommendations$(anything())).once();
      expect(component.productSKUs$).toBeTruthy();
    });

    it('should set productSKUs$ observable to map recommendations', done => {
      const pagelet = {
        definitionQualifiedName: 'fq',
        id: 'id',
        displayName: 'name',
        domain: 'domain',
        configurationParameters: {
          Strategy: 'similar_products',
          MaxNumberOfProducts: 3,
        },
      };
      component.pagelet = createContentPageletView(pagelet);

      component.ngOnChanges();

      component.productSKUs$.subscribe(productSKUs => {
        expect(productSKUs).toEqual(['rec1', 'rec2', 'rec3']);
        done();
      });
    });

    it('should limit products to MaxNumberOfProducts parameter', done => {
      const pagelet = {
        definitionQualifiedName: 'fq',
        id: 'id',
        displayName: 'name',
        domain: 'domain',
        configurationParameters: {
          Strategy: 'similar_products',
          MaxNumberOfProducts: 2,
        },
      };
      component.pagelet = createContentPageletView(pagelet);

      component.ngOnChanges();

      component.productSKUs$.subscribe(productSKUs => {
        expect(productSKUs).toEqual(['rec1', 'rec2']);
        done();
      });
    });

    describe('edge cases', () => {
      it('should handle recommendations without productSKUs', done => {
        when(shoppingFacade.productRecommendations$(anything())).thenReturn(
          of({ strategy: 'similar_products' } as Recommendations)
        );

        const pagelet = {
          definitionQualifiedName: 'fq',
          id: 'id',
          displayName: 'name',
          domain: 'domain',
          configurationParameters: {
            Strategy: 'similar_products',
          },
        };
        component.pagelet = createContentPageletView(pagelet);

        component.ngOnChanges();

        component.productSKUs$.subscribe(productSKUs => {
          expect(productSKUs).toBeEmpty();
          done();
        });
      });

      it('should handle undefined recommendations', done => {
        when(shoppingFacade.productRecommendations$(anything())).thenReturn(of(undefined));

        const pagelet = {
          definitionQualifiedName: 'fq',
          id: 'id',
          displayName: 'name',
          domain: 'domain',
          configurationParameters: {
            Strategy: 'similar_products',
          },
        };
        component.pagelet = createContentPageletView(pagelet);

        component.ngOnChanges();

        component.productSKUs$.subscribe(productSKUs => {
          expect(productSKUs).toBeEmpty();
          done();
        });
      });
    });
  });
});
