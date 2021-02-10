import { APP_BASE_HREF, DOCUMENT, isPlatformServer } from '@angular/common';
import { ApplicationRef, Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction, routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { MetaService } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';
import { Request } from 'express';
import { isEqual } from 'lodash-es';
import { merge, race } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, switchMap, takeWhile, tap, withLatestFrom } from 'rxjs/operators';

import { CategoryHelper } from 'ish-core/models/category/category.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.helper';
import { SeoAttributes } from 'ish-core/models/seo-attributes/seo-attributes.model';
import { generateCategoryUrl, ofCategoryUrl } from 'ish-core/routing/category/category.route';
import { generateProductUrl, ofProductUrl } from 'ish-core/routing/product/product.route';
import { getSelectedContentPage } from 'ish-core/store/content/pages';
import { getAvailableLocales, getCurrentLocale } from 'ish-core/store/core/configuration';
import { ofUrl, selectRouteData, selectRouteParam } from 'ish-core/store/core/router';
import { getSelectedCategory } from 'ish-core/store/shopping/categories/categories.selectors';
import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

@Injectable()
export class SeoEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private meta: MetaService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private doc: Document,
    @Optional() @Inject(REQUEST) private request: Request,
    @Inject(APP_BASE_HREF) private baseHref: string,
    private appRef: ApplicationRef,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  private productPage$ = this.store.pipe(
    ofProductUrl(),
    select(getSelectedProduct),
    filter(p => ProductHelper.isSufficientlyLoaded(p, ProductCompletenessLevel.Detail)),
    filter(p => !ProductHelper.isFailedLoading(p))
  );

  private categoryPage$ = this.store.pipe(
    ofCategoryUrl(),
    select(getSelectedCategory),
    filter(CategoryHelper.isCategoryCompletelyLoaded)
  );

  seoCanonicalLink$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(() =>
          race([
            // PRODUCT PAGE
            this.productPage$.pipe(map(product => this.baseURL(true) + generateProductUrl(product).substr(1))),
            // CATEGORY / FAMILY PAGE
            this.categoryPage$.pipe(map(category => this.baseURL(true) + generateCategoryUrl(category).substr(1))),
            // DEFAULT
            this.appRef.isStable.pipe(whenTruthy(), mapTo(this.doc.URL.replace(/[;?].*/g, ''))),
          ])
        ),
        distinctUntilChanged(),
        tap(url => {
          this.setCanonicalLink(url);
        })
      ),
    { dispatch: false }
  );

  seoMetaData$ = createEffect(
    () =>
      merge(
        this.actions$.pipe(
          ofType(routerNavigationAction),
          // DEFAULT or ROUTING
          switchMap(() => this.store.pipe(select(selectRouteData<SeoAttributes>('meta'))))
        ),
        this.actions$.pipe(
          ofType(routerNavigatedAction),
          switchMap(() =>
            race([
              // PRODUCT PAGE
              this.productPage$.pipe(
                map<ProductView, SeoAttributes>(p => ({
                  'og:image': ProductHelper.getPrimaryImage(p, 'L')?.effectiveUrl,
                  ...p.seoAttributes,
                })),
                whenTruthy()
              ),
              // CATEGORY / FAMILY PAGE
              this.categoryPage$.pipe(mapToProperty('seoAttributes'), whenTruthy()),
              // SEARCH RESULT PAGE
              this.store.pipe(
                ofUrl(/^\/search.*/),
                select(selectRouteParam('searchTerm')),
                whenTruthy(),
                switchMap(searchTerm => this.translate.get('seo.title.search', { 0: searchTerm })),
                map<string, Partial<SeoAttributes>>(title => ({ title }))
              ),
              // CONTENT PAGE
              this.store.pipe(
                ofUrl(/^\/page.*/),
                select(getSelectedContentPage),
                mapToProperty('seoAttributes'),
                whenTruthy()
              ),
            ])
          )
        )
      ).pipe(
        map(attributes => ({
          title: 'seo.defaults.title',
          description: 'seo.defaults.description',
          robots: 'index, follow',
          'og:type': 'website',
          'og:image': `${this.baseURL(false)}assets/img/og-image-default.jpg`,
          ...attributes,
        })),
        distinctUntilChanged(isEqual),
        tap(seoAttributes => {
          this.setSeoAttributes(seoAttributes);
        })
      ),
    { dispatch: false }
  );

  seoLanguages$ = createEffect(
    () =>
      this.actions$.pipe(
        takeWhile(() => isPlatformServer(this.platformId)),
        ofType(routerNavigatedAction),
        withLatestFrom(this.store.pipe(select(getCurrentLocale)), this.store.pipe(select(getAvailableLocales))),
        tap(([, current, locales]) => {
          this.meta.setTag('og:locale', current.lang);
          this.meta.setTag('og:locale:alternate', locales.map(x => x.lang).join(','));
        })
      ),
    { dispatch: false }
  );

  private baseURL(includeBaseHref: boolean) {
    let url: string;
    if (this.request) {
      url = `${this.request.protocol}://${this.request.get('host')}${includeBaseHref ? this.baseHref : ''}`;
    } else {
      url = includeBaseHref ? this.doc.baseURI : this.doc.baseURI.replace(new RegExp(`${this.baseHref}$`), '');
    }
    return url.endsWith('/') ? url : url + '/';
  }

  private setCanonicalLink(url: string) {
    let canonicalLink = this.doc.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = this.doc.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', url);
    this.meta.setTag('og:url', url);
  }

  private setSeoAttributes(seoAttributes: SeoAttributes) {
    Object.entries(seoAttributes)
      .filter(([, v]) => !!v)
      .forEach(([key, value]) => {
        switch (key) {
          case 'title':
            this.meta.setTitle(value);
            break;
          default:
            this.meta.setTag(key, value);
            break;
        }
      });
  }
}
