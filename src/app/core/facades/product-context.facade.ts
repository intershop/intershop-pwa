import { Injectable, InjectionToken, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, first, map, skip, startWith, switchMap } from 'rxjs/operators';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { Image } from 'ish-core/models/image/image.model';
import { ProductLinksDictionary } from 'ish-core/models/product-links/product-links.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper, SkuQuantityType } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { generateProductUrl } from 'ish-core/routing/product/product.route';
import { whenTruthy } from 'ish-core/utils/operators';
import { ProductContextDisplayPropertiesService } from 'ish-core/utils/product-context-display-properties/product-context-display-properties.service';

import { ShoppingFacade } from './shopping.facade';

declare type DisplayEval = ((product: ProductView) => boolean) | boolean;

export interface ProductContextDisplayProperties<T = boolean> {
  readOnly: T;
  name: T;
  description: T;
  sku: T;
  inventory: T;
  price: T;
  promotions: T;
  quantity: T;
  variations: T;
  bundleParts: T;
  retailSetParts: T;
  shipment: T;
  addToBasket: T;
  addToWishlist: T;
  addToOrderTemplate: T;
  addToCompare: T;
  addToQuote: T;
}

const defaultDisplayProperties: ProductContextDisplayProperties<true | undefined> = {
  readOnly: undefined,
  name: true,
  description: true,
  sku: true,
  inventory: true,
  price: true,
  promotions: true,
  quantity: true,
  variations: true,
  bundleParts: true,
  retailSetParts: true,
  shipment: true,
  addToBasket: true,
  addToWishlist: true,
  addToOrderTemplate: true,
  addToCompare: true,
  addToQuote: true,
};

export interface ExternalDisplayPropertiesProvider {
  setup(product$: Observable<ProductView>): Observable<Partial<ProductContextDisplayProperties<false>>>;
}

export const EXTERNAL_DISPLAY_PROPERTY_PROVIDER = new InjectionToken<ExternalDisplayPropertiesProvider>(
  'externalDisplayPropertiesProvider'
);

export interface ProductContext {
  sku: string;
  requiredCompletenessLevel: ProductCompletenessLevel | true;
  product: ProductView;
  productURL: string;
  loading: boolean;
  label: string;
  categoryId: string;
  displayProperties: Partial<ProductContextDisplayProperties>;

  // lazy
  links: ProductLinksDictionary;
  promotions: Promotion[];
  parts: SkuQuantityType[];

  // variation handling
  variationCount: number;

  // compare
  isInCompareList: boolean;

  // quantity
  quantity: number;
  allowZeroQuantity: boolean;
  minQuantity: number;
  maxQuantity: number;
  stepQuantity: number;
  quantityError: string;
  hasQuantityError: boolean;

  // child contexts
  propagateActive: boolean;
  children: ProductContext[];
}

@Injectable()
export class ProductContextFacade extends RxState<ProductContext> {
  private privateConfig$ = new BehaviorSubject<Partial<ProductContextDisplayProperties>>({});
  private loggingActive = false;
  private lazyFieldsInitialized: string[] = [];

  set config(config: Partial<ProductContextDisplayProperties>) {
    this.privateConfig$.next(config);
  }

  constructor(private shoppingFacade: ShoppingFacade, private translate: TranslateService, injector: Injector) {
    super();

    this.set({
      requiredCompletenessLevel: ProductCompletenessLevel.List,
      propagateActive: true,
      allowZeroQuantity: false,
      // tslint:disable-next-line: no-null-keyword
      categoryId: null,
    });

    this.connect(
      combineLatest([
        this.select('sku').pipe(whenTruthy()),
        this.select('requiredCompletenessLevel').pipe(whenTruthy()),
      ]).pipe(
        filter(([sku, level]) => !!sku && !!level),
        switchMap(([sku, level]) =>
          this.shoppingFacade.product$(sku, level).pipe(
            map(product => ({
              product,
              loading: false,
            })),
            startWith({ loading: true })
          )
        )
      )
    );

    this.hold(combineLatest([this.select('product'), this.select('displayProperties')]), args =>
      this.postProductFetch(...args)
    );

    this.connect(
      'productURL',
      combineLatest([
        this.select('product'),
        this.select('categoryId').pipe(switchMap(categoryId => this.shoppingFacade.category$(categoryId))),
      ]).pipe(map(args => generateProductUrl(...args)))
    );

    this.connect(
      'variationCount',
      this.select('sku').pipe(switchMap(sku => this.shoppingFacade.productVariationCount$(sku)))
    );

    this.connect(
      'isInCompareList',
      this.select('sku').pipe(switchMap(sku => this.shoppingFacade.inCompareProducts$(sku)))
    );

    this.connect(
      'minQuantity',
      combineLatest([this.select('product', 'minOrderQuantity'), this.select('allowZeroQuantity')]).pipe(
        map(([minOrderQuantity, allowZeroQuantity]) => (allowZeroQuantity ? 0 : minOrderQuantity))
      )
    );

    this.connect('maxQuantity', this.select('product', 'maxOrderQuantity'));
    this.connect('stepQuantity', this.select('product', 'stepOrderQuantity'));

    this.connect(
      combineLatest([
        this.select('product'),
        this.select('minQuantity'),
        this.select('quantity').pipe(distinctUntilChanged()),
      ]).pipe(
        map(([product, minOrderQuantity, quantity]) => {
          if (product) {
            if (Number.isNaN(quantity)) {
              return this.translate.instant('product.quantity.integer.text');
            } else if (quantity < minOrderQuantity) {
              return this.translate.instant('product.quantity.greaterthan.text', { 0: product.minOrderQuantity });
            } else if (quantity > product.maxOrderQuantity) {
              return this.translate.instant('product.quantity.lessthan.text', { 0: product.maxOrderQuantity });
            } else if (quantity % product.stepOrderQuantity !== 0) {
              return this.translate.instant('product.quantity.step.text', { 0: product.stepOrderQuantity });
            }
          }
          return;
        }),
        map(quantityError => ({
          quantityError,
          hasQuantityError: !!quantityError,
        })),
        distinctUntilChanged(isEqual)
      )
    );

    this.connect(
      'hasQuantityError',
      this.select('children').pipe(
        map(
          children =>
            !children?.filter(x => !!x).length || children.filter(x => !!x).some(child => child.hasQuantityError)
        )
      )
    );

    this.connect(
      'quantity',
      this.select('product').pipe(
        whenTruthy(),
        map(p => p.minOrderQuantity),
        first()
      ),
      (state, minOrderQuantity) => (state.quantity ??= minOrderQuantity)
    );

    this.connect(
      'label',
      this.select('product').pipe(
        map(
          product => ProductHelper.getAttributesOfGroup(product, AttributeGroupTypes.ProductLabelAttributes)?.[0]?.name
        )
      )
    );

    const externalDisplayPropertyProviders = [
      injector.get(ProductContextDisplayPropertiesService),
      ...injector.get<ExternalDisplayPropertiesProvider[]>(EXTERNAL_DISPLAY_PROPERTY_PROVIDER, []),
    ].map(edp => edp.setup(this.select('product')));

    const internalDisplayProperty$ = combineLatest([this.select('product'), this.privateConfig$]).pipe(
      map(([product, privateConfig]) =>
        Object.entries(defaultDisplayProperties)
          .map(([k, v]: [keyof ProductContextDisplayProperties, DisplayEval]) => [k, privateConfig?.[k] ?? v])
          .reduce<Partial<ProductContextDisplayProperties>>(
            (acc, [k, v]: [keyof ProductContextDisplayProperties, DisplayEval]) => {
              acc[k] = typeof v === 'function' ? v(product) : v;
              return acc;
            },
            {}
          )
      )
    );

    this.connect(
      'displayProperties',
      combineLatest([internalDisplayProperty$, ...externalDisplayPropertyProviders]).pipe(
        map(props => props.reduce((acc, p) => ({ ...acc, ...p }), {}))
      )
    );
  }

  private postProductFetch(product: ProductView, displayProperties: Partial<ProductContextDisplayProperties>) {
    if (
      (ProductHelper.isRetailSet(product) || ProductHelper.isMasterProduct(product)) &&
      displayProperties.price &&
      this.get('requiredCompletenessLevel') !== ProductCompletenessLevel.Detail
    ) {
      this.set('requiredCompletenessLevel', () => ProductCompletenessLevel.Detail);
    }
  }

  select(): Observable<ProductContext>;
  select<K1 extends keyof ProductContext>(k1: K1): Observable<ProductContext[K1]>;
  select<K1 extends keyof ProductContext, K2 extends keyof ProductContext[K1]>(
    k1: K1,
    k2: K2
  ): Observable<ProductContext[K1][K2]>;

  select<K1 extends keyof ProductContext, K2 extends keyof ProductContext[K1]>(k1?: K1, k2?: K2) {
    const wrap = <K extends keyof ProductContext>(key: K, obs: Observable<ProductContext[K]>) => {
      if (!this.lazyFieldsInitialized.includes(key)) {
        this.connect(key, obs);
        this.lazyFieldsInitialized.push(key);
      }
    };

    switch (k1) {
      case 'links':
        wrap('links', this.shoppingFacade.productLinks$(this.select('sku')));
        break;
      case 'promotions':
        wrap(
          'promotions',
          combineLatest([this.select('displayProperties', 'promotions'), this.select('product', 'promotionIds')]).pipe(
            filter(([visible]) => !!visible),
            switchMap(([, ids]) => this.shoppingFacade.promotions$(ids))
          )
        );
        break;
      case 'parts':
        wrap(
          'parts',
          combineLatest([
            this.select('displayProperties', 'bundleParts'),
            this.select('displayProperties', 'retailSetParts'),
          ]).pipe(
            filter(([a, b]) => a || b),
            switchMap(() => this.shoppingFacade.productParts$(this.select('sku')))
          )
        );
    }
    return k2 ? super.select(k1, k2) : k1 ? super.select(k1) : super.select();
  }

  log(val: boolean) {
    if (!this.loggingActive) {
      this.hold(this.select().pipe(filter(() => !!val)), ctx => {
        // tslint:disable-next-line: no-console
        console.log(ctx);
      });
    }
  }

  changeVariationOption(name: string, value: string) {
    this.set('sku', () => ProductVariationHelper.findPossibleVariation(name, value, this.get('product')));
  }

  addToBasket() {
    const childContexts = this.get('children') || this.get('parts');
    if (childContexts && !ProductHelper.isProductBundle(this.get('product'))) {
      childContexts
        .filter(x => !!x && !!x.quantity)
        .forEach(child => {
          this.shoppingFacade.addProductToBasket(child.sku, child.quantity);
        });
    } else {
      this.shoppingFacade.addProductToBasket(this.get('sku'), this.get('quantity'));
    }
  }

  toggleCompare() {
    this.shoppingFacade.toggleProductCompare(this.get('sku'));
  }

  addToCompare() {
    this.shoppingFacade.addProductToCompare(this.get('sku'));
  }

  propagate(index: number, childState: ProductContext) {
    this.set('children', state => {
      const current = [...(state.children || [])];
      current[index] = childState;
      return current;
    });
    this.set('displayProperties', state => ({
      ...state.displayProperties,
      readOnly: true,
      addToBasket: true,
    }));
  }

  validDebouncedQuantityUpdate$(time = 800) {
    return this.select('quantity').pipe(
      debounceTime(time),
      filter(() => !this.get('hasQuantityError')),
      distinctUntilChanged(),
      skip(1)
    );
  }

  getProductImage$(imageType: string, imageView: string): Observable<Image> {
    return this.select('product').pipe(
      whenTruthy(),
      map(product =>
        imageView
          ? ProductHelper.getImageByImageTypeAndImageView(product, imageType, imageView)
          : ProductHelper.getPrimaryImage(product, imageType)
      )
    );
  }
}
