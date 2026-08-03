import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, Renderer2, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, map, shareReplay } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.helper';
import { ProductData } from 'ish-core/models/product/product.interface';

interface FaqEntry {
  question: string;
  answer: string;
  authorName?: string;
  authorDescription?: string;
  authorOrganization?: string;
}

interface HowToStep {
  position: number;
  name: string;
  text: string;
}

interface HowToData {
  name?: string;
  steps: HowToStep[];
}

@Component({
  selector: 'ish-product-detail-info',
  standalone: false,
  templateUrl: './product-detail-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailInfoComponent implements OnInit {
  product$: Observable<ProductView>;
  isVariationMaster$: Observable<boolean>;
  faqs$: Observable<FaqEntry[]>;
  howToSteps$: Observable<HowToStep[]>;
  active = 'DESCRIPTION'; // default product tab

  private faqScriptEl: HTMLScriptElement | undefined;
  private howToScriptEl: HTMLScriptElement | undefined;

  private destroyRef = inject(DestroyRef);
  private context = inject(ProductContextFacade);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  ngOnInit() {
    this.product$ = this.context.select('product');
    this.isVariationMaster$ = this.context.select('product').pipe(map(ProductHelper.isMasterProduct));

    const faqs$ = this.context.select('product').pipe(
      map(product => this.parseFaqs(product.attributeGroups)),
      shareReplay(1)
    );
    const howTo$ = this.context.select('product').pipe(
      map(product => this.parseHowTo(product.attributeGroups)),
      shareReplay(1)
    );

    this.faqs$ = faqs$;
    this.howToSteps$ = howTo$.pipe(map(h => h.steps));

    faqs$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(faqs => {
      this.faqScriptEl = this.upsertJsonLdScript(this.faqScriptEl, faqs.length ? this.buildFaqJsonLd(faqs) : undefined);
    });

    howTo$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(howTo => {
      this.howToScriptEl = this.upsertJsonLdScript(
        this.howToScriptEl,
        howTo.steps.length ? this.buildHowToJsonLd(howTo) : undefined
      );
    });

    this.destroyRef.onDestroy(() => {
      this.upsertJsonLdScript(this.faqScriptEl, undefined);
      this.upsertJsonLdScript(this.howToScriptEl, undefined);
    });

    // when routing between products reset the opened product tab to the default tab
    this.context
      .select('sku')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => (this.active = 'DESCRIPTION'));
  }

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
