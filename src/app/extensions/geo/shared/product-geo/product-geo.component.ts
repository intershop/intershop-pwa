import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductData } from 'ish-core/models/product/product.interface';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { FaqEntry, HowToData, HowToStep } from '../../models/geo.model';

export { FaqEntry, HowToData, HowToStep };

export type ProductGeoType = 'faqs' | 'howTo';

@Component({
  selector: 'ish-product-geo',
  standalone: false,
  templateUrl: './product-geo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductGeoComponent implements OnInit {
  @Input({ required: true }) type: ProductGeoType;

  faqs$: Observable<FaqEntry[]>;
  howToSteps$: Observable<HowToStep[]>;

  private context = inject(ProductContextFacade);

  ngOnInit() {
    if (this.type === 'faqs') {
      this.initFaqs();
    } else if (this.type === 'howTo') {
      this.initHowTo();
    }
  }

  private initFaqs(): void {
    this.faqs$ = this.context.select('product').pipe(
      map(product => this.parseFaqs(product.attributeGroups)),
      shareReplay(1)
    );
  }

  private initHowTo(): void {
    this.howToSteps$ = this.context.select('product').pipe(
      map(product => this.parseHowTo(product.attributeGroups)),
      map(h => h.steps),
      shareReplay(1)
    );
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
}
