import { Injectable, InjectionToken, Injector, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Observable, combineLatest, race } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  first,
  map,
  skip,
  skipWhile,
  startWith,
  switchMap,
  take,
} from 'rxjs/operators';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { Image } from 'ish-core/models/image/image.model';
import { Pricing } from 'ish-core/models/price/price.model';
import { ProductLinksDictionary } from 'ish-core/models/product-links/product-links.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper, SkuQuantityType } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { generateProductUrl } from 'ish-core/routing/product/product.route';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';
import { ProductContextDisplayPropertiesService } from 'ish-core/utils/product-context-display-properties/product-context-display-properties.service';

import { AppFacade } from './app.facade';
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
  prices: Pricing;
  hasProductError: boolean;
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
  children: Record<string | number, ProductContext>;
}

@Injectable()
export class ProductContextFacade extends RxState<ProductContext> implements OnDestroy {
  private privateConfig$ = new BehaviorSubject<Partial<ProductContextDisplayProperties>>({});
  private loggingActive: boolean;
  private lazyFieldsInitialized: string[] = [];

  set config(config: Partial<ProductContextDisplayProperties>) {
    this.privateConfig$.next(config);
  }

  private validProductSKU$ = this.select('product').pipe(
    filter(p => !!p && !p.failed),
    mapToProperty('sku')
  );

  constructor(
    private shoppingFacade: ShoppingFacade,
    private appFacade: AppFacade,
    private translate: TranslateService,
    injector: Injector
  ) {
    super();

    this.set({
      requiredCompletenessLevel: ProductCompletenessLevel.List,
      propagateActive: true,
      allowZeroQuantity: false,
      children: {},
      // eslint-disable-next-line unicorn/no-null
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
      ]).pipe(
        map(args => generateProductUrl(...args)),
        distinctUntilChanged()
      )
    );

    this.connect(
      'variationCount',
      this.select('sku').pipe(switchMap(sku => this.shoppingFacade.productVariationCount$(sku)))
    );

    this.connect(
      'minQuantity',
      combineLatest([this.select('product'), this.select('allowZeroQuantity')]).pipe(
        map(([product, allowZeroQuantity]) => (allowZeroQuantity ? 0 : product.minOrderQuantity || 1)),
        distinctUntilChanged()
      )
    );

    this.connect(
      'maxQuantity',
      combineLatest([this.select('product'), this.appFacade.serverSetting$<number>('basket.maxItemQuantity')]).pipe(
        map(([product, fromConfig]) => product?.maxOrderQuantity || fromConfig || 100),
        distinctUntilChanged()
      )
    );

    this.connect(
      'stepQuantity',
      this.select('product').pipe(
        map(product => product?.stepOrderQuantity || 1),
        distinctUntilChanged()
      )
    );

    this.connect(
      combineLatest([
        this.select('product'),
        this.select('minQuantity'),
        this.select('maxQuantity'),
        this.select('stepQuantity'),
        this.select('quantity').pipe(distinctUntilChanged()),
      ]).pipe(
        map(([product, minOrderQuantity, maxOrderQuantity, stepQuantity, quantity]) => {
          if (product && !product.failed) {
            if (Number.isNaN(quantity)) {
              return this.translate.instant('product.quantity.integer.text');
            } else if (quantity < minOrderQuantity) {
              return this.translate.instant('product.quantity.greaterthan.text', { 0: minOrderQuantity });
            } else if (quantity > maxOrderQuantity) {
              return this.translate.instant('product.quantity.lessthan.text', { 0: maxOrderQuantity });
            } else if (quantity % stepQuantity !== 0) {
              return this.translate.instant('product.quantity.step.text', { 0: stepQuantity });
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
      this.select('sku').pipe(
        whenTruthy(),
        distinctUntilChanged(),
        switchMap(() =>
          this.select('children').pipe(
            map(children => Object.values(children)),
            debounceTime(300),
            skipWhile(children => !children?.length),
            map(children => !children.length || children.some(child => child.hasQuantityError)),
            distinctUntilChanged()
          )
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
      'quantity',
      this.select('product').pipe(
        whenTruthy(),
        distinctUntilKeyChanged('sku'),
        map(p => p.minOrderQuantity),
        skip(1)
      )
    );

    this.connect(
      'quantity',
      this.select('sku').pipe(
        whenTruthy(),
        distinctUntilChanged(),
        switchMap(() =>
          this.select('children').pipe(
            map(children => Object.values(children)),
            debounceTime(300),
            skipWhile(children => !children?.length),
            map(children =>
              children.reduce(
                (sum, child) =>
                  sum +
                  (Number.isInteger(child.quantity) && !child.hasQuantityError && !child.hasProductError
                    ? child.quantity
                    : 0),
                0
              )
            ),
            distinctUntilChanged()
          )
        )
      )
    );

    this.connect(
      'hasProductError',
      this.select('product').pipe(
        map(product => !!product && (!!product.failed || !product.available)),
        distinctUntilChanged()
      )
    );

    this.connect(
      'hasProductError',
      this.select('sku').pipe(
        whenTruthy(),
        distinctUntilChanged(),
        switchMap(() =>
          this.select('children').pipe(
            map(children => Object.values(children)),
            debounceTime(300),
            skipWhile(children => !children?.length),
            map(children => !children.length || children.some(child => child.hasProductError)),
            distinctUntilChanged()
          )
        )
      )
    );

    this.connect(
      'label',
      this.select('product').pipe(
        map(
          product =>
            // eslint-disable-next-line unicorn/no-null
            ProductHelper.getAttributesOfGroup(product, AttributeGroupTypes.ProductLabelAttributes)?.[0]?.name || null
        ),
        distinctUntilChanged()
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

    this.connect('displayProperties', this.privateConfig$);

    this.connect(
      'displayProperties',
      combineLatest([internalDisplayProperty$, ...externalDisplayPropertyProviders]).pipe(
        map(props => props.reduce((acc, p) => ({ ...acc, ...p }), {}))
      )
    );

    // set display properties for a parent context
    this.connect(
      'displayProperties',
      race(
        this.select('children').pipe(
          skipWhile(children => !children || !Object.values(children)?.length),
          map(() => true)
        ),
        this.select('parts').pipe(
          skipWhile(parts => !parts?.length),
          map(() => true)
        ),
        this.select('sku').pipe(map(() => false))
      ).pipe(take(1)),
      (state, setStandaloneProperties) =>
        setStandaloneProperties
          ? {
              ...state.displayProperties,
              readOnly: state.displayProperties.readOnly ?? true,
              addToBasket: state.displayProperties.addToBasket ?? true,
            }
          : state.displayProperties
    );
  }

  private get isMaximumLevel(): boolean {
    return (
      this.get('requiredCompletenessLevel') === ProductCompletenessLevel.Detail ||
      this.get('requiredCompletenessLevel') === true
    );
  }

  private postProductFetch(product: ProductView, displayProperties: Partial<ProductContextDisplayProperties>) {
    if (
      (ProductHelper.isRetailSet(product) || ProductHelper.isMasterProduct(product)) &&
      displayProperties.price &&
      !this.isMaximumLevel
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
        wrap('links', this.shoppingFacade.productLinks$(this.validProductSKU$));
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
            switchMap(() => this.shoppingFacade.productParts$(this.validProductSKU$))
          )
        );
        break;
      case 'prices':
        wrap(
          'prices',
          combineLatest([
            this.select('displayProperties', 'price'),
            this.select('product').pipe(
              filter(p => !!p && !p.failed),
              mapToProperty('sku'),
              distinctUntilChanged()
            ),
            this.select('requiredCompletenessLevel').pipe(
              map(completeness => completeness === true),
              distinctUntilChanged()
            ),
          ]).pipe(
            filter(([visible]) => !!visible),
            switchMap(([, sku, fresh]) => this.shoppingFacade.productPrices$(sku, fresh))
          )
        );
        break;
    }
    return k2 ? super.select(k1, k2) : k1 ? super.select(k1) : super.select();
  }

  log(val: boolean) {
    if (!this.loggingActive) {
      this.hold(this.select().pipe(filter(() => !!val)), ctx => {
        // eslint-disable-next-line no-console
        console.log(ctx);
      });
    }
  }

  changeVariationOption(name: string, value: string) {
    this.set('sku', () => ProductVariationHelper.findPossibleVariation(name, value, this.get('product')));
  }

  addToBasket() {
    let items: SkuQuantityType[];
    if (Object.values(this.get('children'))?.length) {
      items = Object.values(this.get('children'));
    } else if (this.get('parts')?.length && !ProductHelper.isProductBundle(this.get('product'))) {
      items = this.get('parts');
    } else {
      items = [this.get()];
    }

    items
      .filter(x => !!x && !!x.quantity)
      .forEach(child => {
        this.shoppingFacade.addProductToBasket(child.sku, child.quantity);
      });
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

  ngOnDestroy(): void {
    if (this.get('propagateActive')) {
      this.set('propagateActive', () => false);
    }
    super.ngOnDestroy();
  }
}
