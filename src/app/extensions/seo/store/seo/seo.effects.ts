import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { MetaService } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';
import { mapToParam, ofRoute } from 'ngrx-router';
import { debounce, distinctUntilKeyChanged, filter, first, map, switchMap, tap } from 'rxjs/operators';

import { ProductHelper } from 'ish-core/models/product/product.helper';
import { SeoAttributes } from 'ish-core/models/seo-attribute/seo-attribute.model';
import { generateProductUrl, ofProductRoute } from 'ish-core/routing/product/product.route';
import { getSelectedContentPage } from 'ish-core/store/content/pages';
import { CategoriesActionTypes } from 'ish-core/store/shopping/categories';
import { getSelectedCategory } from 'ish-core/store/shopping/categories/categories.selectors';
import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { mapToPayload, mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { SeoActionTypes, SetSeoAttributes } from './seo.actions';

@Injectable()
export class SeoEffects {
  canonicalLink: HTMLLinkElement;
  baseURL: string;
  ogImageDefault: string;

  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private meta: MetaService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    // tslint:disable-next-line:no-any
    @Optional() @Inject(REQUEST) private request: any
  ) {
    // get baseURL
    if (isPlatformServer(this.platformId)) {
      this.baseURL = `${this.request.protocol}://${this.request.get('host') +
        this.doc.querySelector('base').getAttribute('href')}`;
    } else {
      this.baseURL = this.doc.baseURI;
    }

    // set og:image default (needs to be an absolute URL)
    this.ogImageDefault = `${this.baseURL}assets/img/og-image-default.jpg`;
    this.meta.setTag('og:image', this.ogImageDefault);

    // set canonical default
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
        this.meta.setTag('og:image', seoAttributes['og:image'] || this.ogImageDefault);
        this.canonicalLink.setAttribute('href', this.baseURL + seoAttributes.canonical || this.doc.URL);
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
              canonical: `category/${c.uniqueId}`,
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
    ofProductRoute(),
    switchMap(() =>
      this.store.pipe(
        select(getSelectedProduct),
        whenTruthy(),
        filter(p => !ProductHelper.isFailedLoading(p)),
        map(p => (ProductHelper.isVariationProduct(p) && p.productMaster()) || p),
        distinctUntilKeyChanged('sku'),
        map(p => {
          const productImage = ProductHelper.getPrimaryImage(p, 'L');
          const seoAttributes = {
            canonical: generateProductUrl(p),
            'og:image': productImage && productImage.effectiveUrl,
          };
          return p.seoAttributes ? { ...seoAttributes, ...p.seoAttributes } : seoAttributes;
        }),
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
