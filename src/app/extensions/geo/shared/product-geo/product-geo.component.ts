import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { GeoHelper } from '../../models/geo/geo.helper';
import { FaqEntry, HowToStep } from '../../models/geo/geo.model';

type ProductGeoType = 'faqs' | 'howTo';

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

  private context = inject(ProductContextFacade);

  ngOnInit() {
    if (this.type === 'faqs') {
      this.faqs$ = this.context.select('product').pipe(
        map(product => GeoHelper.parseFaqs(product.attributeGroups)),
        shareReplay(1)
      );
    } else if (this.type === 'howTo') {
      this.howToSteps$ = this.context.select('product').pipe(
        map(product => GeoHelper.parseHowTo(product.attributeGroups).steps),
        shareReplay(1)
      );
    }
  }
}
