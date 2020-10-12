import { DOCUMENT, isPlatformServer } from '@angular/common';
import { ApplicationRef, Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction, routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { MetaService } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';
import { Request } from 'express';
import { isEqual } from 'lodash-es';
import { Observable, merge, race } from 'rxjs';
import { distinctUntilChanged, filter, first, map, mapTo, switchMap, switchMapTo, tap } from 'rxjs/operators';

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
  private baseURL: string;
  private ogImageDefault: string;

  constructor(
    private actions$: Actions,
    private store: Store,
    private meta: MetaService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: string,
    @Optional() @Inject(REQUEST) private request: Request,
    private appRef: ApplicationRef
  ) {
    // get baseURL
    if (isPlatformServer(this.platformId)) {
      this.baseURL = `${this.request.protocol}://${
        this.request.get('host') + this.doc.querySelector('base').getAttribute('href')
      }`;
    } else {
      this.baseURL = this.doc.baseURI;
    }

    // og:image default (needs to be an absolute URL)
    this.ogImageDefault = `${this.baseURL}assets/img/og-image-default.jpg`;
  }

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
            this.productPage$.pipe(map(product => this.baseURL + generateProductUrl(product).substr(1))),
            // CATEGORY / FAMILY PAGE
            this.categoryPage$.pipe(map(category => this.baseURL + generateCategoryUrl(category).substr(1))),
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
                mapToProperty('displayName'),
                whenTruthy(),
                map<string, Partial<SeoAttributes>>(title => ({ title }))
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
          'og:image': this.ogImageDefault,
          ...attributes,
        })),
        distinctUntilChanged(isEqual),
        tap(seoAttributes => {
          this.setSeoAttributes(seoAttributes);
        })
      ),
    { dispatch: false }
  );

  seoLanguage$ = createEffect(
    () =>
      this.waitAppStable(
        this.store.pipe(
          select(getCurrentLocale),
          whenTruthy(),
          tap(current => {
            this.meta.setTag('og:locale', current.lang);
          })
        )
      ),
    { dispatch: false }
  );

  seoAlternateLanguages$ = createEffect(
    () =>
      this.waitAppStable(
        this.store.pipe(
          select(getAvailableLocales),
          whenTruthy(),
          tap(locales => {
            this.meta.setTag('og:locale:alternate', locales.map(x => x.lang).join(','));
          })
        )
      ),
    { dispatch: false }
  );

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

  private waitAppStable<T>(obs: Observable<T>) {
    return this.appRef.isStable.pipe(whenTruthy(), first(), switchMapTo(obs));
  }
}
