import { DOCUMENT, isPlatformServer } from '@angular/common';
import { ApplicationRef, Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { MetaService } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  first,
  map,
  switchMap,
  switchMapTo,
  tap,
} from 'rxjs/operators';

import { CategoryHelper } from 'ish-core/models/category/category.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.helper';
import { SeoAttributes } from 'ish-core/models/seo-attributes/seo-attributes.model';
import { ofCategoryUrl } from 'ish-core/routing/category/category.route';
import { generateProductUrl, ofProductUrl } from 'ish-core/routing/product/product.route';
import { getAvailableLocales, getCurrentLocale } from 'ish-core/store/configuration';
import { getSelectedContentPage } from 'ish-core/store/content/pages';
import { ofUrl, selectRouteParam } from 'ish-core/store/router';
import { getSelectedCategory } from 'ish-core/store/shopping/categories/categories.selectors';
import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { mapToPayload, mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { SeoActionTypes, SetSeoAttributes } from './seo.actions';

@Injectable()
export class SeoEffects {
  baseURL: string;
  ogImageDefault: string;

  constructor(
    private actions$: Actions,
    private store: Store,
    private meta: MetaService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    // tslint:disable-next-line:no-any
    @Optional() @Inject(REQUEST) private request: any,
    private appRef: ApplicationRef
  ) {
    // get baseURL
    if (isPlatformServer(this.platformId)) {
      this.baseURL = `${this.request.protocol}://${this.request.get('host') +
        this.doc.querySelector('base').getAttribute('href')}`;
    } else {
      this.baseURL = this.doc.baseURI;
    }

    // og:image default (needs to be an absolute URL)
    this.ogImageDefault = `${this.baseURL}assets/img/og-image-default.jpg`;
  }

  @Effect({ dispatch: false })
  seoCanonicalLink$ = this.actions$.pipe(
    ofType(routerNavigatedAction),
    tap(() => {
      let canonicalLink = this.doc.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = this.doc.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        this.doc.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', this.doc.URL);
      this.meta.setTag('og:url', this.doc.URL);
    })
  );

  @Effect({ dispatch: false })
  setMetaData$ = this.actions$.pipe(
    ofType(SeoActionTypes.SetSeoAttributes),
    mapToPayload(),
    whenTruthy(),
    tap((seoAttributes: SeoAttributes) => {
      if (seoAttributes) {
        this.meta.setTitle(seoAttributes.title);
        this.meta.setTag('og:image', seoAttributes['og:image'] || this.ogImageDefault);
        Object.keys(seoAttributes)
          .filter(key => key !== 'title' && key !== 'og:image')
          .forEach(key => {
            this.meta.setTag(key, seoAttributes[key]);
          });
      }
    })
  );

  @Effect()
  seoCategory$ = this.waitAppStable(
    this.store.pipe(
      ofCategoryUrl(),
      select(getSelectedCategory),
      filter(CategoryHelper.isCategoryCompletelyLoaded),
      map(
        c =>
          c &&
          c.seoAttributes && {
            canonical: `category/${c.uniqueId}`,
            ...c.seoAttributes,
          }
      ),
      whenTruthy(),
      map(x => new SetSeoAttributes(x))
    )
  );

  @Effect()
  seoProduct$ = this.waitAppStable(
    this.store.pipe(
      ofProductUrl(),
      select(getSelectedProduct),
      filter(p => ProductHelper.isSufficientlyLoaded(p, ProductCompletenessLevel.Detail)),
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
      whenTruthy(),
      map(x => new SetSeoAttributes(x))
    )
  );

  @Effect()
  seoSearch$ = this.waitAppStable(
    this.store.pipe(
      ofUrl(/^\/search.*/),
      select(selectRouteParam('searchTerm')),
      switchMap(searchTerm => this.translate.get('seo.title.search', { 0: searchTerm })),
      whenTruthy(),
      map(title => new SetSeoAttributes({ title }))
    )
  );

  @Effect()
  seoContentPage$ = this.waitAppStable(
    this.store.pipe(
      ofUrl(/^\/page.*/),
      select(getSelectedContentPage),
      mapToProperty('displayName'),
      whenTruthy(),
      distinctUntilChanged(),
      map(title => new SetSeoAttributes({ title }))
    )
  );

  @Effect({ dispatch: false })
  seoLanguage$ = this.waitAppStable(
    this.store.pipe(
      select(getCurrentLocale),
      whenTruthy(),
      tap(current => {
        this.meta.setTag('og:locale', current.lang);
      })
    )
  );

  @Effect({ dispatch: false })
  seoAlternateLanguages$ = this.waitAppStable(
    this.store.pipe(
      select(getAvailableLocales),
      whenTruthy(),
      tap(locales => {
        this.meta.setTag('og:locale:alternate', locales.map(x => x.lang).join(','));
      })
    )
  );

  private waitAppStable<T>(obs: Observable<T>) {
    return this.appRef.isStable.pipe(
      whenTruthy(),
      first(),
      switchMapTo(obs)
    );
  }
}
