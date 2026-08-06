import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { distinctUntilChanged, filter, map, startWith, switchMap, tap } from 'rxjs/operators';

import { ProductData } from 'ish-core/models/product/product.interface';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { ofProductUrl } from 'ish-core/routing/product/product.route';
import { getSelectedProduct } from 'ish-core/store/shopping/products';

import { FaqEntry, HowToData, HowToStep } from '../../models/geo.model';

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
        tap(() => {
          this.faqScriptEl = this.upsertJsonLdScript(this.faqScriptEl, undefined);
        }),
        switchMap(() =>
          this.productPage$.pipe(
            map(product => this.parseFaqs(product.attributeGroups)),
            distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
            tap(faqs => {
              this.faqScriptEl = this.upsertJsonLdScript(
                this.faqScriptEl,
                faqs.length ? this.buildFaqJsonLd(faqs) : undefined
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
        tap(() => {
          this.howToScriptEl = this.upsertJsonLdScript(this.howToScriptEl, undefined);
        }),
        switchMap(() =>
          this.productPage$.pipe(
            map(product => this.parseHowTo(product.attributeGroups)),
            distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
            tap(howTo => {
              this.howToScriptEl = this.upsertJsonLdScript(
                this.howToScriptEl,
                howTo.steps.length ? this.buildHowToJsonLd(howTo) : undefined
              );
            })
          )
        )
      ),
    { dispatch: false }
  );

  private parseFaqs(attributeGroups: ProductData['attributeGroups']): FaqEntry[] {
    const attr = attributeGroups?.GEO?.attributes?.find(a => a.name === 'GEO_FAQ');
    if (!attr?.value) {
      return [];
    }
    try {
      const val = typeof attr.value === 'string' ? JSON.parse(attr.value) : attr.value;
      const entities = Array.isArray(val) ? val : val?.mainEntity;
      if (!Array.isArray(entities)) {
        return [];
      }
      return entities.map(
        (e: {
          name: string;
          acceptedAnswer: {
            text: string;
            author?: { name?: string; description?: string; affiliation?: { name?: string } };
          };
        }) => ({
          question: e.name,
          answer: e.acceptedAnswer?.text,
          authorName: e.acceptedAnswer?.author?.name,
          authorDescription: e.acceptedAnswer?.author?.description,
          authorOrganization: e.acceptedAnswer?.author?.affiliation?.name,
        })
      );
    } catch {
      return [];
    }
  }

  private parseHowTo(attributeGroups: ProductData['attributeGroups']): HowToData {
    const attr = attributeGroups?.GEO?.attributes?.find(a => a.name === 'GEO_HOW_TO');
    if (!attr?.value) {
      return { steps: [] };
    }
    try {
      const val = typeof attr.value === 'string' ? JSON.parse(attr.value) : attr.value;
      const steps = Array.isArray(val) ? val : val?.step;
      if (!Array.isArray(steps)) {
        return { steps: [] };
      }
      return {
        name: typeof val?.name === 'string' ? val.name : undefined,
        steps: steps.map((s: HowToStep) => ({ position: s.position, name: s.name, text: s.text })),
      };
    } catch {
      return { steps: [] };
    }
  }

  private buildFaqJsonLd(faqs: FaqEntry[]): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
          ...(faq.authorName
            ? {
                author: {
                  '@type': 'Person',
                  name: faq.authorName,
                  ...(faq.authorDescription ? { description: faq.authorDescription } : {}),
                  ...(faq.authorOrganization
                    ? { affiliation: { '@type': 'Organization', name: faq.authorOrganization } }
                    : {}),
                },
              }
            : {}),
        },
      })),
    };
  }

  private buildHowToJsonLd(howTo: HowToData): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      ...(howTo.name ? { name: howTo.name } : {}),
      step: howTo.steps.map(s => ({
        '@type': 'HowToStep',
        position: s.position,
        name: s.name,
        text: s.text,
      })),
    };
  }

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
