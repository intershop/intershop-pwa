import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { MetaService } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';
import { mapToParam, ofRoute } from 'ngrx-router';
import { debounce, distinctUntilKeyChanged, first, map, switchMap, tap } from 'rxjs/operators';

import { ProductHelper } from 'ish-core/models/product/product.helper';
import { SeoAttributes } from 'ish-core/models/seo-attribute/seo-attribute.model';
import { generateProductRoute } from 'ish-core/pipes/product-route.pipe';
import { getSelectedContentPage } from 'ish-core/store/content/pages';
import { CategoriesActionTypes } from 'ish-core/store/shopping/categories';
import { getSelectedCategory } from 'ish-core/store/shopping/categories/categories.selectors';
import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { mapToPayload, mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { SeoActionTypes, SetSeoAttributes } from './seo.actions';

@Injectable()
export class SeoEffects {
  canonicalLink: HTMLLinkElement;

  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private meta: MetaService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.canonicalLink = this.doc.querySelector('link[rel="canonical"]');
    if (!this.canonicalLink) {
      this.canonicalLink = this.doc.createElement('link');
      this.canonicalLink.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(this.canonicalLink);
    }
    this.canonicalLink.setAttribute('href', this.doc.URL);
  }

  @Effect({ dispatch: false })
  setMetaData$ = this.actions$.pipe(
    ofType(SeoActionTypes.SetSeoAttributes),
    mapToPayload(),
    whenTruthy(),
    tap((seoAttributes: SeoAttributes) => {
      if (seoAttributes) {
        this.meta.setTitle(seoAttributes.metaTitle);
        this.meta.setTag('description', seoAttributes.metaDescription);
        this.meta.setTag('robots', seoAttributes.robots && seoAttributes.robots.join(','));
        this.canonicalLink.setAttribute('href', seoAttributes.canonical || this.doc.URL);
      }
    })
  );

  @Effect()
  seoCategory$ = this.actions$.pipe(
    ofRoute('category/:categoryUniqueId'),
    debounce(() => this.actions$.pipe(ofType(CategoriesActionTypes.SelectedCategoryAvailable))),
    switchMap(() =>
      this.store.pipe(
        select(getSelectedCategory),
        map(
          c =>
            c &&
            c.seoAttributes && {
              canonical: `/category/${c.uniqueId}`,
              ...c.seoAttributes,
            }
        ),
        whenTruthy(),
        first()
      )
    ),
    map(x => new SetSeoAttributes(x))
  );

  @Effect()
  seoProduct$ = this.actions$.pipe(
    ofRoute(['product/:sku/**', 'category/:categoryUniqueId/product/:sku/**']),
    switchMap(() =>
      this.store.pipe(
        select(getSelectedProduct),
        whenTruthy(),
        map(p => (ProductHelper.isVariationProduct(p) && p.productMaster()) || p),
        distinctUntilKeyChanged('sku'),
        map(
          p =>
            p &&
            p.seoAttributes && {
              canonical: generateProductRoute(p, p.defaultCategory()),
              ...p.seoAttributes,
            }
        ),
        whenTruthy()
      )
    ),
    map(x => new SetSeoAttributes(x))
  );

  @Effect()
  seoSearch$ = this.actions$.pipe(
    ofRoute('search/:searchTerm'),
    mapToParam<string>('searchTerm'),
    switchMap(searchTerm => this.translate.get('seo.title.search', { 0: searchTerm })),
    whenTruthy(),
    map(metaTitle => new SetSeoAttributes({ metaTitle }))
  );

  @Effect()
  seoContentPage$ = this.actions$.pipe(
    ofRoute('page/:contentPageId'),
    switchMap(() =>
      this.store.pipe(
        select(getSelectedContentPage),
        mapToProperty('displayName'),
        whenTruthy()
      )
    ),
    map(metaTitle => new SetSeoAttributes({ metaTitle }))
  );
}
