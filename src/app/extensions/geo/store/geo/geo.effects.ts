import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { distinctUntilChanged, filter, map, startWith, switchMap, tap } from 'rxjs/operators';

import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { ofProductUrl } from 'ish-core/routing/product/product.route';
import { getSelectedProduct } from 'ish-core/store/shopping/products';

import { GeoHelper } from '../../models/geo/geo.helper';

@Injectable()
export class GeoEffects {
  private renderer: Renderer2;
  private faqScriptEl: HTMLScriptElement | undefined;
  private howToScriptEl: HTMLScriptElement | undefined;

  constructor(
    private actions$: Actions,
    private store: Store,
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

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
          this.faqScriptEl = this.upsertJsonLdScript(this.faqScriptEl, undefined);
        }),
        // adds new script tag on route change if faq data is available
        switchMap(() =>
          this.productPage$.pipe(
            map(product => GeoHelper.parseFaqs(product.attributeGroups)),
            distinctUntilChanged(isEqual),
            tap(faqs => {
              this.faqScriptEl = this.upsertJsonLdScript(
                this.faqScriptEl,
                faqs.length ? GeoHelper.buildFaqJsonLd(faqs) : undefined
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
          this.howToScriptEl = this.upsertJsonLdScript(this.howToScriptEl, undefined);
        }),
        // adds new script tag on route change if how-to data is available
        switchMap(() =>
          this.productPage$.pipe(
            map(product => GeoHelper.parseHowTo(product.attributeGroups)),
            distinctUntilChanged(isEqual),
            tap(howTo => {
              this.howToScriptEl = this.upsertJsonLdScript(
                this.howToScriptEl,
                howTo.steps.length ? GeoHelper.buildHowToJsonLd(howTo) : undefined
              );
            })
          )
        )
      ),
    { dispatch: false }
  );

  private upsertJsonLdScript(
    existing: HTMLScriptElement | undefined,
    jsonLd: object | undefined
  ): HTMLScriptElement | undefined {
    if (!jsonLd) {
      if (existing) {
        this.renderer.removeChild(this.document.head, existing);
      }
      return;
    }
    const el: HTMLScriptElement = existing ?? this.renderer.createElement('script');
    this.renderer.setAttribute(el, 'type', 'application/ld+json');
    this.renderer.setProperty(el, 'text', JSON.stringify(jsonLd, undefined, 2));
    if (!existing) {
      this.renderer.appendChild(this.document.head, el);
    }
    return el;
  }
}
