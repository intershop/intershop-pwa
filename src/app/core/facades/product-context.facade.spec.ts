import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { omit, pick } from 'lodash-es';
import { BehaviorSubject, EMPTY, Observable, Subject, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { AttributeGroup } from 'ish-core/models/attribute-group/attribute-group.model';
import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { PriceHelper } from 'ish-core/models/price/price.helper';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';

import { AppFacade } from './app.facade';
import {
  EXTERNAL_DISPLAY_PROPERTY_PROVIDER,
  ExternalDisplayPropertiesProvider,
  ProductContext,
  ProductContextDisplayProperties,
  ProductContextFacade,
} from './product-context.facade';
import { ShoppingFacade } from './shopping.facade';

function pickQuantityFields(context: ProductContextFacade) {
  return pick(
    context.get(),
    Object.keys(context.get()).filter(k => k.toLocaleLowerCase().includes('quantity'))
  );
}

describe('Product Context Facade', () => {
  let context: ProductContextFacade;
  let shoppingFacade: ShoppingFacade;

  beforeEach(() => {
    shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.category$(anything())).thenReturn(of(undefined));
    when(shoppingFacade.productVariationCount$(anything())).thenReturn(of(undefined));

    const appFacade = mock(AppFacade);
    when(appFacade.serverSetting$(anything())).thenReturn(of(undefined));

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
        ProductContextFacade,
      ],
    });

    context = TestBed.inject(ProductContextFacade);
  });

  it('should be created', () => {
    expect(context).toBeTruthy();
    expect(context.get()).toMatchInlineSnapshot(`
      {
        "allowZeroQuantity": false,
        "categoryId": null,
        "children": {},
        "displayProperties": {},
        "propagateActive": true,
        "requiredCompletenessLevel": 1,
      }
    `);
    verify(shoppingFacade.productLinks$(anything())).never();
    verify(shoppingFacade.promotions$(anything())).never();
    expect(context.get('loading')).toBeFalsy();
  });

  describe('loading', () => {
    it('should set loading state when accessing product', () => {
      when(shoppingFacade.product$(anything(), anything())).thenReturn(EMPTY);
      context.set('sku', () => '123');

      expect(context.get('loading')).toBeTrue();
    });
  });

  describe('with out-of-stock product', () => {
    let product: ProductView;

    beforeEach(() => {
      product = {
        sku: '123',
        completenessLevel: ProductCompletenessLevel.Detail,
        minOrderQuantity: 10,
        maxOrderQuantity: 100,
        stepQuantity: 10,
        available: false,
        readyForShipmentMin: 0,
        readyForShipmentMax: 2,
      } as ProductView;

      when(shoppingFacade.product$(anything(), anything())).thenReturn(of(product));

      context.set('sku', () => '123');
    });

    it('should update context for retrieved product', () => {
      expect(context.get('product')).toEqual(product);

      expect(omit(context.get(), 'displayProperties', 'product')).toMatchInlineSnapshot(`
        {
          "allowZeroQuantity": false,
          "categoryId": null,
          "children": {},
          "hasProductError": true,
          "hasQuantityError": false,
          "label": null,
          "loading": false,
          "maxQuantity": 100,
          "minQuantity": 10,
          "productURL": "/prd123",
          "propagateActive": true,
          "quantity": 10,
          "quantityError": undefined,
          "requiredCompletenessLevel": 1,
          "sku": "123",
          "stepQuantity": 10,
        }
      `);
    });

    it('should set correct display properties for out-of-stock product', () => {
      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        {
          "addToBasket": false,
          "addToCompare": true,
          "addToNotification": true,
          "addToOrderTemplate": false,
          "addToQuote": false,
          "addToWishlist": true,
          "bundleParts": false,
          "description": true,
          "inventory": true,
          "name": true,
          "price": true,
          "promotions": true,
          "quantity": false,
          "readOnly": undefined,
          "retailSetParts": false,
          "shipment": false,
          "sku": true,
          "variations": false,
        }
      `);
    });
  });

  describe('with a normal product', () => {
    let product: ProductView;

    beforeEach(() => {
      product = {
        sku: '123',
        completenessLevel: ProductCompletenessLevel.Detail,
        minOrderQuantity: 10,
        maxOrderQuantity: 100,
        stepQuantity: 10,
        available: true,
        readyForShipmentMin: 0,
        readyForShipmentMax: 2,
      } as ProductView;

      when(shoppingFacade.product$(anything(), anything())).thenReturn(of(product));

      context.set('sku', () => '123');
    });

    it('should update context for retrieved product', () => {
      expect(context.get('product')).toEqual(product);

      expect(omit(context.get(), 'displayProperties', 'product')).toMatchInlineSnapshot(`
        {
          "allowZeroQuantity": false,
          "categoryId": null,
          "children": {},
          "hasProductError": false,
          "hasQuantityError": false,
          "label": null,
          "loading": false,
          "maxQuantity": 100,
          "minQuantity": 10,
          "productURL": "/prd123",
          "propagateActive": true,
          "quantity": 10,
          "quantityError": undefined,
          "requiredCompletenessLevel": 1,
          "sku": "123",
          "stepQuantity": 10,
        }
      `);
    });

    it('should not adapt required completeness level for normal product', () => {
      expect(context.get('requiredCompletenessLevel')).toEqual(ProductCompletenessLevel.Base);
    });

    describe('quantity handling', () => {
      it('should start with min order quantity for product', () => {
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          {
            "allowZeroQuantity": false,
            "hasQuantityError": false,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": 10,
            "quantityError": undefined,
            "stepQuantity": 10,
          }
        `);
      });

      it('should go to error with quantity lower than min order', () => {
        context.set('quantity', () => 1);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": 1,
            "quantityError": "product.quantity.greaterthan.text",
            "stepQuantity": 10,
          }
        `);
      });

      it('should go to error with quantity not multiple of step', () => {
        context.set('quantity', () => 15);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": 15,
            "quantityError": "product.quantity.step.text",
            "stepQuantity": 10,
          }
        `);
      });

      it('should not go to error with zero quantity if allowed', () => {
        context.set('allowZeroQuantity', () => true);
        context.set('quantity', () => 0);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          {
            "allowZeroQuantity": true,
            "hasQuantityError": false,
            "maxQuantity": 100,
            "minQuantity": 0,
            "quantity": 0,
            "quantityError": undefined,
            "stepQuantity": 10,
          }
        `);
      });

      it('should go to error if max order quantity is exceeded', () => {
        context.set('quantity', () => 1000);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": 1000,
            "quantityError": "product.quantity.lessthan.text",
            "stepQuantity": 10,
          }
        `);
      });

      it('should go to error if quantity is NaN', () => {
        context.set('quantity', () => NaN);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": NaN,
            "quantityError": "product.quantity.integer.text",
            "stepQuantity": 10,
          }
        `);
      });

      it('should go to error if quantity is null', () => {
        // eslint-disable-next-line unicorn/no-null
        context.set('quantity', () => null);
        expect(pickQuantityFields(context)).toMatchInlineSnapshot(`
          {
            "allowZeroQuantity": false,
            "hasQuantityError": true,
            "maxQuantity": 100,
            "minQuantity": 10,
            "quantity": null,
            "quantityError": "product.quantity.greaterthan.text",
            "stepQuantity": 10,
          }
        `);
      });
    });

    describe('lazy property handling', () => {
      beforeEach(() => {
        when(shoppingFacade.productLinks$(anything())).thenReturn(of({}));
      });

      it('should not load product links until subscription', done => {
        verify(shoppingFacade.productLinks$(anything())).never();

        context.select('links').subscribe(() => {
          verify(shoppingFacade.productLinks$(anything())).once();
          done();
        });
      });
    });

    describe('display properties', () => {
      it('should set correct display properties for product', () => {
        context.set('prices', () => ({ salePrice: PriceHelper.empty() }));
        expect(context.get('displayProperties')).toMatchInlineSnapshot(`
          {
            "addToBasket": true,
            "addToCompare": true,
            "addToNotification": true,
            "addToOrderTemplate": true,
            "addToQuote": true,
            "addToWishlist": true,
            "bundleParts": false,
            "description": true,
            "inventory": true,
            "name": true,
            "price": true,
            "promotions": true,
            "quantity": true,
            "readOnly": undefined,
            "retailSetParts": false,
            "shipment": true,
            "sku": true,
            "variations": false,
          }
        `);
      });

      it('should include external displayProperty overrides when calculating', () => {
        context.set('prices', () => ({ salePrice: PriceHelper.empty() }));
        context.config = {
          readOnly: true,
          name: false,
        };

        expect(context.get('displayProperties')).toMatchInlineSnapshot(`
          {
            "addToBasket": true,
            "addToCompare": true,
            "addToNotification": true,
            "addToOrderTemplate": true,
            "addToQuote": true,
            "addToWishlist": true,
            "bundleParts": false,
            "description": true,
            "inventory": true,
            "name": false,
            "price": true,
            "promotions": true,
            "quantity": true,
            "readOnly": true,
            "retailSetParts": false,
            "shipment": true,
            "sku": true,
            "variations": false,
          }
        `);
      });
    });
  });

  describe('category handling', () => {
    describe('with product with default category', () => {
      let product: ProductView;

      beforeEach(() => {
        product = {
          sku: '123',
          name: '123',
          completenessLevel: ProductCompletenessLevel.Detail,
          defaultCategory: {
            uniqueId: 'ABC',
            name: 'ABC',
            pathElements: [{ uniqueId: 'ABC', name: 'ABC' } as Category],
          } as CategoryView,
          defaultCategoryId: 'ABC',
        } as ProductView;

        when(shoppingFacade.product$(anything(), anything())).thenReturn(of(product));

        context.set('sku', () => '123');
      });

      it('should calculate the url property of the product with default category', () => {
        expect(context.get('productURL')).toMatchInlineSnapshot(`"/abc/123-prd123-ctgABC"`);
      });
    });

    describe('with product with context category', () => {
      let product: ProductView;

      beforeEach(() => {
        product = {
          sku: '123',
          name: '123',
          completenessLevel: ProductCompletenessLevel.Detail,
        } as ProductView;

        when(shoppingFacade.product$(anything(), anything())).thenReturn(of(product));
        when(shoppingFacade.category$(anything())).thenReturn(
          of({ uniqueId: 'ASDF', pathElements: [{ uniqueId: 'ASDF', name: 'ASDF' } as Category] } as CategoryView)
        );

        context.set('categoryId', () => 'ASDF');
        context.set('sku', () => '123');
      });

      it('should calculate the url property of the product with context category', () => {
        expect(context.get('productURL')).toMatchInlineSnapshot(`"/asdf/123-prd123-ctgASDF"`);
      });
    });

    describe('with product with context category and default category', () => {
      let product: ProductView;

      beforeEach(() => {
        product = {
          sku: '123',
          name: 'abc123',
          completenessLevel: ProductCompletenessLevel.Detail,
          defaultCategory: {
            uniqueId: 'ABC',
            name: 'ABC',
            pathElements: [{ uniqueId: 'ABC', name: 'ABC' } as Category],
          } as CategoryView,
        } as ProductView;

        when(shoppingFacade.product$(anything(), anything())).thenReturn(of(product));
        when(shoppingFacade.category$(anything())).thenReturn(
          of({ uniqueId: 'ASDF', pathElements: [{ uniqueId: 'ASDF', name: 'ASDF' } as Category] } as CategoryView)
        );
        context.set('categoryId', () => 'ASDF');
        context.set('sku', () => '123');
      });

      it('should calculate the url property of the product with context category', () => {
        expect(context.get('productURL')).toMatchInlineSnapshot(`"/asdf/abc123-prd123-ctgASDF"`);
      });
    });
  });

  describe('with product having labels', () => {
    let product: ProductView;

    beforeEach(() => {
      product = {
        sku: '123',
        completenessLevel: ProductCompletenessLevel.Detail,
      } as ProductView;

      product.attributeGroups = {
        [AttributeGroupTypes.ProductLabelAttributes]: {
          attributes: [{ name: 'sale', type: 'Boolean', value: 'true' }],
        } as AttributeGroup,
      };

      when(shoppingFacade.product$(anything(), anything())).thenReturn(of(product));

      context.set('sku', () => '123');
    });

    it('should calculate the label property of the product', () => {
      expect(context.get('label')).toMatchInlineSnapshot(`"sale"`);
    });
  });

  describe('with a retail set', () => {
    beforeEach(() => {
      when(shoppingFacade.product$(anything(), anything())).thenReturn(
        of({
          sku: '123',
          completenessLevel: ProductCompletenessLevel.Detail,
          minOrderQuantity: 1,
          maxOrderQuantity: 100,
          type: 'RetailSet',
          available: true,
        } as ProductView)
      );
      when(shoppingFacade.productParts$(anything())).thenReturn(
        of([
          { sku: 'p1', quantity: 1 },
          { sku: 'p2', quantity: 1 },
        ])
      );
      context.set('sku', () => '123');
    });

    it('should set parts property for retail set', done => {
      context.select('parts').subscribe(parts => {
        expect(parts).toMatchInlineSnapshot(`
          [
            {
              "quantity": 1,
              "sku": "p1",
            },
            {
              "quantity": 1,
              "sku": "p2",
            },
          ]
        `);
        done();
      });
    });

    it('should set correct display properties for retail set', () => {
      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        {
          "addToBasket": true,
          "addToCompare": true,
          "addToNotification": false,
          "addToOrderTemplate": true,
          "addToQuote": true,
          "addToWishlist": true,
          "bundleParts": false,
          "description": true,
          "inventory": false,
          "name": true,
          "price": true,
          "promotions": true,
          "quantity": false,
          "readOnly": undefined,
          "retailSetParts": true,
          "shipment": false,
          "sku": true,
          "variations": false,
        }
      `);
    });

    it('should adapt required completeness level to detail', () => {
      expect(context.get('requiredCompletenessLevel')).toEqual(ProductCompletenessLevel.Detail);
    });
  });

  describe('with a bundle', () => {
    beforeEach(() => {
      when(shoppingFacade.product$(anything(), anything())).thenReturn(
        of({
          sku: '123',
          completenessLevel: ProductCompletenessLevel.Detail,
          minOrderQuantity: 1,
          maxOrderQuantity: 100,
          type: 'Bundle',
          available: true,
          readyForShipmentMin: 0,
          readyForShipmentMax: 2,
        } as ProductView)
      );
      when(shoppingFacade.productParts$(anything())).thenReturn(
        of([
          { sku: 'p1', quantity: 1 },
          { sku: 'p2', quantity: 2 },
        ])
      );
      context.set('prices', () => ({ salePrice: PriceHelper.empty() }));
      context.set('sku', () => '123');
    });

    it('should set parts property for bundle', done => {
      context.select('parts').subscribe(parts => {
        expect(parts).toMatchInlineSnapshot(`
          [
            {
              "quantity": 1,
              "sku": "p1",
            },
            {
              "quantity": 2,
              "sku": "p2",
            },
          ]
        `);
        done();
      });
    });

    it('should set correct display properties for bundle', () => {
      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        {
          "addToBasket": true,
          "addToCompare": true,
          "addToNotification": true,
          "addToOrderTemplate": true,
          "addToQuote": true,
          "addToWishlist": true,
          "bundleParts": true,
          "description": true,
          "inventory": true,
          "name": true,
          "price": true,
          "promotions": true,
          "quantity": true,
          "readOnly": undefined,
          "retailSetParts": false,
          "shipment": true,
          "sku": true,
          "variations": false,
        }
      `);
    });
  });

  describe('with a variation product', () => {
    let product: ProductView;

    beforeEach(() => {
      product = {
        sku: '123',
        completenessLevel: ProductCompletenessLevel.Detail,
        minOrderQuantity: 1,
        maxOrderQuantity: 100,
        type: 'VariationProduct',
        available: true,
        readyForShipmentMin: 0,
        readyForShipmentMax: 2,
      } as ProductView;
      when(shoppingFacade.product$(anything(), anything())).thenReturn(of(product));

      context.set('prices', () => ({ salePrice: PriceHelper.empty() }));
      context.set('sku', () => '123');
    });

    it('should set correct display properties for variation product', () => {
      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        {
          "addToBasket": true,
          "addToCompare": true,
          "addToNotification": true,
          "addToOrderTemplate": true,
          "addToQuote": true,
          "addToWishlist": true,
          "bundleParts": false,
          "description": true,
          "inventory": true,
          "name": true,
          "price": true,
          "promotions": true,
          "quantity": true,
          "readOnly": undefined,
          "retailSetParts": false,
          "shipment": true,
          "sku": true,
          "variations": true,
        }
      `);
    });
  });

  describe('with a master product', () => {
    let product: ProductView;

    beforeEach(() => {
      product = {
        sku: '123',
        completenessLevel: ProductCompletenessLevel.Detail,
        minOrderQuantity: 1,
        maxOrderQuantity: 100,
        available: true,
        type: 'VariationProductMaster',
      } as ProductView;
      when(shoppingFacade.product$(anything(), anything())).thenReturn(of(product));

      context.set('sku', () => '123');
    });

    it('should set correct display properties for master product', () => {
      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        {
          "addToBasket": false,
          "addToCompare": false,
          "addToNotification": false,
          "addToOrderTemplate": false,
          "addToQuote": false,
          "addToWishlist": false,
          "bundleParts": false,
          "description": true,
          "inventory": false,
          "name": true,
          "price": true,
          "promotions": true,
          "quantity": false,
          "readOnly": undefined,
          "retailSetParts": false,
          "shipment": false,
          "sku": true,
          "variations": false,
        }
      `);
    });
  });

  describe('add to basket handling', () => {
    let product: ProductView;

    beforeEach(() => {
      product = {
        sku: '123',
        completenessLevel: ProductCompletenessLevel.Detail,
        available: true,
      } as ProductView;

      when(shoppingFacade.product$(anything(), anything())).thenReturn(of(product));

      context.set('sku', () => '123');
    });

    it('should set "addToBasket" to "false" for a product without a price', () => {
      expect(context.get('displayProperties', 'addToBasket')).toMatchInlineSnapshot(`false`);
    });

    it('should set "addToBasket" to "true" for a product with price', () => {
      context.set('prices', () => ({ salePrice: PriceHelper.empty() }));
      expect(context.get('displayProperties', 'addToBasket')).toMatchInlineSnapshot(`true`);
    });

    it('should set "addToBasket" to "true" for a retail set independend from a price', () => {
      when(shoppingFacade.product$(anything(), anything())).thenReturn(
        of({
          sku: '456',
          completenessLevel: ProductCompletenessLevel.Detail,
          type: 'RetailSet',
          available: true,
        } as ProductView)
      );
      context.set('sku', () => '456');

      expect(context.get('displayProperties', 'addToBasket')).toMatchInlineSnapshot(`true`);
    });
  });
});

describe('Product Context Facade', () => {
  let context: ProductContextFacade;
  let shoppingFacade: ShoppingFacade;

  describe('with display property providers', () => {
    let product: ProductView;
    let someOther$: Subject<boolean>;

    class ProviderA implements ExternalDisplayPropertiesProvider {
      setup(
        context$: Observable<Pick<ProductContext, 'product' | 'prices'>>
      ): Observable<Partial<ProductContextDisplayProperties<false>>> {
        return context$.pipe(
          map(({ product }) =>
            product?.sku === '456'
              ? {
                  addToBasket: false,
                  addToCompare: false,
                  addToOrderTemplate: false,
                  addToQuote: false,
                  addToWishlist: false,
                }
              : {}
          )
        );
      }
    }

    class ProviderB implements ExternalDisplayPropertiesProvider {
      setup(
        context$: Observable<Pick<ProductContext, 'product' | 'prices'>>
      ): Observable<Partial<ProductContextDisplayProperties<false>>> {
        return context$.pipe(
          map(() => ({
            shipment: false,
            promotions: false,
          }))
        );
      }
    }

    class ProviderC implements ExternalDisplayPropertiesProvider {
      setup(
        context$: Observable<Pick<ProductContext, 'product' | 'prices'>>
      ): Observable<Partial<ProductContextDisplayProperties<false>>> {
        return context$.pipe(
          switchMap(() => someOther$),
          map(prop => (prop ? { price: false } : {}))
        );
      }
    }

    beforeEach(() => {
      someOther$ = new BehaviorSubject(false);

      shoppingFacade = mock(ShoppingFacade);
      when(shoppingFacade.category$(anything())).thenReturn(EMPTY);
      when(shoppingFacade.productVariationCount$(anything())).thenReturn(of(undefined));

      product = {
        completenessLevel: ProductCompletenessLevel.Detail,
        minOrderQuantity: 10,
        maxOrderQuantity: 100,
        stepQuantity: 10,
        available: true,
        readyForShipmentMin: 0,
        readyForShipmentMax: 2,
      } as ProductView;

      when(shoppingFacade.product$(anyString(), anything())).thenCall(sku => of({ ...product, sku }));

      const appFacade = mock(AppFacade);
      when(appFacade.serverSetting$(anything())).thenReturn(of(undefined));

      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        providers: [
          { provide: AppFacade, useFactory: () => instance(appFacade) },
          { provide: EXTERNAL_DISPLAY_PROPERTY_PROVIDER, useClass: ProviderA, multi: true },
          { provide: EXTERNAL_DISPLAY_PROPERTY_PROVIDER, useClass: ProviderB, multi: true },
          { provide: EXTERNAL_DISPLAY_PROPERTY_PROVIDER, useClass: ProviderC, multi: true },
          { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
          ProductContextFacade,
        ],
      });

      context = TestBed.inject(ProductContextFacade);
    });

    it('should set correct display properties respecting overrides from providers for product 123', () => {
      context.set('prices', () => ({ salePrice: PriceHelper.empty() }));
      context.set('sku', () => '123');

      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        {
          "addToBasket": true,
          "addToCompare": true,
          "addToNotification": true,
          "addToOrderTemplate": true,
          "addToQuote": true,
          "addToWishlist": true,
          "bundleParts": false,
          "description": true,
          "inventory": true,
          "name": true,
          "price": true,
          "promotions": false,
          "quantity": true,
          "readOnly": undefined,
          "retailSetParts": false,
          "shipment": false,
          "sku": true,
          "variations": false,
        }
      `);

      someOther$.next(true);

      expect(context.get('displayProperties', 'price')).toMatchInlineSnapshot(`false`);
    });

    it('should set correct display properties respecting overrides from providers for product 456', () => {
      context.set('sku', () => '456');

      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        {
          "addToBasket": false,
          "addToCompare": false,
          "addToNotification": true,
          "addToOrderTemplate": false,
          "addToQuote": false,
          "addToWishlist": false,
          "bundleParts": false,
          "description": true,
          "inventory": true,
          "name": true,
          "price": true,
          "promotions": false,
          "quantity": true,
          "readOnly": undefined,
          "retailSetParts": false,
          "shipment": false,
          "sku": true,
          "variations": false,
        }
      `);

      someOther$.next(true);

      expect(context.get('displayProperties', 'price')).toMatchInlineSnapshot(`false`);
    });

    it('should include external displayProperty overrides when calculating', () => {
      context.set('sku', () => '456');

      context.config = {
        readOnly: true,
        name: false,
      };

      expect(context.get('displayProperties')).toMatchInlineSnapshot(`
        {
          "addToBasket": false,
          "addToCompare": false,
          "addToNotification": true,
          "addToOrderTemplate": false,
          "addToQuote": false,
          "addToWishlist": false,
          "bundleParts": false,
          "description": true,
          "inventory": true,
          "name": false,
          "price": true,
          "promotions": false,
          "quantity": true,
          "readOnly": true,
          "retailSetParts": false,
          "shipment": false,
          "sku": true,
          "variations": false,
        }
      `);
    });
  });
});
