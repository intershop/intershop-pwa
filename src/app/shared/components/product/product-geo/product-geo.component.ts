import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, Renderer2, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, map, shareReplay } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductData } from 'ish-core/models/product/product.interface';

export interface FaqEntry {
  question: string;
  answer: string;
  authorName?: string;
  authorDescription?: string;
  authorOrganization?: string;
}

export interface HowToStep {
  position: number;
  name: string;
  text: string;
}

export interface HowToData {
  name?: string;
  steps: HowToStep[];
}

export type ProductGeoType = 'faqs' | 'howTo';

@Component({
  selector: 'ish-product-geo',
  standalone: false,
  templateUrl: './product-geo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGeoComponent implements OnInit {
  @Input({ required: true }) type: ProductGeoType;

  faqs$: Observable<FaqEntry[]>;
  howToSteps$: Observable<HowToStep[]>;

  private scriptEl: HTMLScriptElement | undefined;
  private destroyRef = inject(DestroyRef);
  private context = inject(ProductContextFacade);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  ngOnInit() {
    if (this.type === 'faqs') {
      this.initFaqs();
    } else if (this.type === 'howTo') {
      this.initHowTo();
    }

    this.destroyRef.onDestroy(() => {
      this.removeScript();
    });
  }

  private initFaqs(): void {
    const faqs$ = this.context.select('product').pipe(
      map(product => this.parseFaqs(product.attributeGroups)),
      shareReplay(1)
    );
    this.faqs$ = faqs$;

    faqs$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(faqs => {
      this.scriptEl = this.upsertJsonLdScript(this.scriptEl, faqs.length ? this.buildFaqJsonLd(faqs) : undefined);
    });
  }

  private initHowTo(): void {
    const howTo$ = this.context.select('product').pipe(
      map(product => this.parseHowTo(product.attributeGroups)),
      shareReplay(1)
    );
    this.howToSteps$ = howTo$.pipe(map(h => h.steps));

    howTo$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(howTo => {
      this.scriptEl = this.upsertJsonLdScript(
        this.scriptEl,
        howTo.steps.length ? this.buildHowToJsonLd(howTo) : undefined
      );
    });
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

  private removeScript(): void {
    this.upsertJsonLdScript(this.scriptEl, undefined);
  }
}
