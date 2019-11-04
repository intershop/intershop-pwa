import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { MetaService } from '@ngx-meta/core';
import { TranslateService } from '@ngx-translate/core';
import { mapToParam, ofRoute } from 'ngrx-router';
import { debounce, first, map, switchMap, tap } from 'rxjs/operators';

import { SeoAttributes } from 'ish-core/models/seo-attribute/seo-attribute.model';
import { getSelectedContentPage } from 'ish-core/store/content/pages';
import { CategoriesActionTypes } from 'ish-core/store/shopping/categories';
import { getSelectedCategory } from 'ish-core/store/shopping/categories/categories.selectors';
import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { mapToPayload, mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { SeoActionTypes, SetSeoAttributes } from './seo.actions';

@Injectable()
export class SeoEffects {
  constructor(
    private actions$: Actions,
    private store: Store<{}>,
    private meta: MetaService,
    private translate: TranslateService
  ) {}

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
        mapToProperty('seoAttributes'),
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
        mapToProperty('seoAttributes'),
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
