import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, filter, map, startWith, switchMap, tap } from 'rxjs/operators';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { ofProductUrl } from 'ish-core/routing/product/product.route';
import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { DomService } from 'ish-core/utils/dom/dom.service';

import { GeoHelper } from '../../models/geo/geo.helper';
import { SchemaFAQPage, SchemaHowTo } from '../../models/geo/geo.model';

@Injectable()
export class GeoEffects {
  private faqScriptEl: HTMLScriptElement | undefined;
  private howToScriptEl: HTMLScriptElement | undefined;

  constructor(
    private actions$: Actions,
    private store: Store,
    private domService: DomService
  ) {}

  private productPage$ = this.store.pipe(
    ofProductUrl(),
    select(getSelectedProduct),
    filter(p => ProductHelper.isSufficientlyLoaded(p, ProductCompletenessLevel.Detail)),
    filter(p => !ProductHelper.isFailedLoading(p))
  );

  geoFaqJsonLd$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigationAction),
        // fire immediately on (lazy) subscription to catch the current route
        startWith(undefined),
        // removes existing script tag on route change
        tap(() => {
          this.faqScriptEl = this.domService.upsertJsonLdScript(this.faqScriptEl, undefined);
        }),
        // adds new script tag on route change if faq data is available
        switchMap(() =>
          this.productPage$.pipe(
            map(
              product =>
                ProductHelper.getAttributesOfGroup(
                  product,
                  AttributeGroupTypes.ProductGeoAttributes
                ) as Attribute<string>[]
            ),
            map(geo => AttributeHelper.getAttributeByAttributeName(geo, 'GEO_FAQ')?.value as string),
            map(geoFaq => GeoHelper.parseGeoAttribute<SchemaFAQPage>(geoFaq)),
            distinctUntilChanged(isEqual),
            tap(faq => {
              this.faqScriptEl = this.domService.upsertJsonLdScript(
                this.faqScriptEl,
                faq?.mainEntity?.length ? faq : undefined
              );
            })
          )
        )
      ),
    { dispatch: false }
  );

  geoHowToJsonLd$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(routerNavigationAction),
        // fire immediately on (lazy) subscription to catch the current route
        startWith(undefined),
        // removes existing script tag on route change
        tap(() => {
          this.howToScriptEl = this.domService.upsertJsonLdScript(this.howToScriptEl, undefined);
        }),
        // adds new script tag on route change if how-to data is available
        switchMap(() =>
          this.productPage$.pipe(
            map(
              product =>
                ProductHelper.getAttributesOfGroup(
                  product,
                  AttributeGroupTypes.ProductGeoAttributes
                ) as Attribute<string>[]
            ),
            map(geo => AttributeHelper.getAttributeByAttributeName(geo, 'GEO_HOW_TO')?.value as string),
            map(geoHowTo => GeoHelper.parseGeoAttribute<SchemaHowTo>(geoHowTo)),
            distinctUntilChanged(isEqual),
            tap(howTo => {
              this.howToScriptEl = this.domService.upsertJsonLdScript(
                this.howToScriptEl,
                howTo.step?.length ? howTo : undefined
              );
            })
          )
        )
      ),
    { dispatch: false }
  );
}
