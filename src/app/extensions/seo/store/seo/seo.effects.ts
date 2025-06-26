import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction, routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { combineLatest, merge, race } from 'rxjs';
import { delay, distinctUntilChanged, filter, map, switchMap, takeWhile, tap } from 'rxjs/operators';

import { CategoryHelper } from 'ish-core/models/category/category.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { SeoAttributes } from 'ish-core/models/seo-attributes/seo-attributes.model';
import { ofCategoryUrl } from 'ish-core/routing/category/category.route';
import { ofContentPageUrl } from 'ish-core/routing/content-page/content-page.route';
import { ofProductUrl } from 'ish-core/routing/product/product.route';
import { getSelectedContentPage } from 'ish-core/store/content/pages';
import { getAvailableLocales, getCurrentLocale } from 'ish-core/store/core/configuration';
import { ofUrl, selectPath, selectRouteData, selectRouteParam } from 'ish-core/store/core/router';
import { getSelectedCategory } from 'ish-core/store/shopping/categories/categories.selectors';
import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { SeoService } from '../../services/seo/seo.service';

@Injectable()
export class SeoEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private metaService: Meta,
    private titleService: Title,
    private translate: TranslateService,
    private seoService: SeoService
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

  private contentPage$ = this.store.pipe(ofContentPageUrl(), select(getSelectedContentPage));

  seoCanonicalLink$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigatedAction),
        switchMap(() => this.seoService.resolveCanonicalUrl()),
        distinctUntilChanged(),
        tap(url => {
          this.seoService.setCanonicalLink(url);
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
          this.seoService.setSeoAttributes(seoAttributes);
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
      this.seoService.pageTitle$.pipe(
        delay(0), // ensures asynchronous stream processing to prevent "missing translation" issues
        switchMap(title =>
          combineLatest([
            this.translate.get(title),
            this.store.pipe(select(selectPath)),
            this.translate.get('seo.applicationName'),
          ])
        ),
        map(([title, path, application]) => [this.seoService.enhancePageTitle(title, path), application]),
        map(([title, application]) => `${title} | ${application}`),
        tap(title => {
          this.titleService.setTitle(title);
          this.seoService.addOrModifyTag({ property: 'og:title', content: title });
        })
      ),
    { dispatch: false }
  );

  seoDescription$ = createEffect(
    () =>
      this.seoService.pageDescription$.pipe(
        delay(0), // ensures asynchronous stream processing to prevent "missing translation" issues
        switchMap(description => this.translate.get(description)),
        tap(description => {
          this.seoService.addOrModifyTag({ name: 'description', content: description });
          this.seoService.addOrModifyTag({ property: 'og:description', content: description });
        })
      ),
    { dispatch: false }
  );
}
