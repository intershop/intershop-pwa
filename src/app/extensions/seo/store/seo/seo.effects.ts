import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { ApplicationRef, Inject, Injectable, Optional } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction, routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { TranslateService } from '@ngx-translate/core';
import { Request } from 'express';
import { isEqual } from 'lodash-es';
import { Subject, combineLatest, merge, race } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeWhile, tap } from 'rxjs/operators';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { CategoryHelper } from 'ish-core/models/category/category.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { SeoAttributes } from 'ish-core/models/seo-attributes/seo-attributes.model';
import { generateCategoryUrl, ofCategoryUrl } from 'ish-core/routing/category/category.route';
import { ofContentPageUrl } from 'ish-core/routing/content-page/content-page.route';
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
    private metaService: Meta,
    private titleService: Title,
    private translate: TranslateService,
    @Inject(DOCUMENT) private doc: Document,
    @Optional() @Inject(REQUEST) private request: Request,
    @Inject(APP_BASE_HREF) private baseHref: string,
    private appRef: ApplicationRef
  ) {}

  private pageTitle$ = new Subject<string>();
  private pageDescription$ = new Subject<string>();

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

  private contentPage$ = this.store.pipe(ofContentPageUrl(), select(getSelectedContentPage));

  seoCanonicalLink$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(() =>
          race([
            // PRODUCT PAGE
            this.productPage$.pipe(map(product => this.baseURL + generateProductUrl(product).substring(1))),
            // CATEGORY / FAMILY PAGE
            this.categoryPage$.pipe(
              map((category: CategoryView) => this.baseURL + generateCategoryUrl(category).substring(1))
            ),
            // DEFAULT
            this.appRef.isStable.pipe(
              whenTruthy(),
              map(() => this.doc.URL.replace(/[;?].*/g, ''))
            ),
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
              this.contentPage$.pipe(mapToProperty('seoAttributes'), whenTruthy()),
            ])
          )
        )
      ).pipe(
        map(attributes => ({
          title: 'seo.defaults.title',
          description: 'seo.defaults.description',
          robots: 'index, follow',
          'og:type': 'website',
          'og:image': '/assets/img/og-image-default.jpg',
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
      combineLatest([
        this.store.pipe(select(getCurrentLocale)),
        this.store.pipe(select(getAvailableLocales), whenTruthy()),
      ]).pipe(
        takeWhile(() => SSR),
        tap(([current, locales]) => {
          this.metaService.addTag({ property: 'og:locale', content: current });

          this.metaService
            .getTags('property="og:locale:alternate"')
            .forEach(el => this.metaService.removeTagElement(el));
          locales
            .filter(lang => lang !== current)
            .forEach(lang => this.metaService.addTag({ property: 'og:locale:alternate', content: lang }, true));
        })
      ),
    { dispatch: false }
  );

  seoTitle$ = createEffect(
    () =>
      this.pageTitle$.pipe(
        switchMap(title => combineLatest([this.translate.get(title), this.translate.get('seo.applicationName')])),
        map(([title, application]) => `${title} | ${application}`),
        tap(title => {
          this.titleService.setTitle(title);
          this.addOrModifyTag({ property: 'og:title', content: title });
        })
      ),
    { dispatch: false }
  );

  seoDescription$ = createEffect(
    () =>
      this.pageDescription$.pipe(
        switchMap(description => this.translate.get(description)),
        tap(description => {
          this.addOrModifyTag({ name: 'description', content: description });
          this.addOrModifyTag({ property: 'og:description', content: description });
        })
      ),
    { dispatch: false }
  );

  private get baseURL() {
    let url: string;
    if (this.request) {
      url = `${this.request.protocol}://${this.request.get('host')}${this.baseHref}`;
    } else {
      url = this.doc.baseURI;
    }
    return url.endsWith('/') ? url : `${url}/`;
  }

  private setCanonicalLink(url: string) {
    // the canonical URL of a production system should always be with 'https:'
    // even though the PWA SSR container itself is usually not deployed in an SSL environment so the URLs need manual adaption
    const canonicalUrl = url.replace('http:', 'https:');
    let canonicalLink = this.doc.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = this.doc.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);
    this.addOrModifyTag({ property: 'og:url', content: canonicalUrl });
  }

  private setSeoAttributes(seoAttributes: SeoAttributes) {
    Object.entries(seoAttributes)
      .filter(([, v]) => !!v)
      .forEach(([key, value]) => {
        switch (key) {
          case 'title':
            this.pageTitle$.next(value);
            return;
          case 'description':
            this.pageDescription$.next(value);
            return;
          case 'robots':
            this.addOrModifyTag({ name: key, content: value });
            return;
        }
        this.addOrModifyTag({ property: key.startsWith('og:') ? key : `og:${key}`, content: value });
      });
    this.addOrModifyTag({ property: 'pwa-version', content: PWA_VERSION });
  }

  private addOrModifyTag(tag: MetaDefinition) {
    if (!this.metaService.updateTag(tag)) {
      this.metaService.addTag(tag);
    }
  }
}
