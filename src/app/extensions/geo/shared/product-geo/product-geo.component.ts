import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { ProductHelper } from 'ish-core/models/product/product.helper';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { GeoHelper } from '../../models/geo/geo.helper';
import { FaqEntry, SchemaHowTo } from '../../models/geo/geo.model';

type ProductGeoType = 'faq' | 'howto';

@Component({
  selector: 'ish-product-geo',
  standalone: false,
  templateUrl: './product-geo.component.html',
  styleUrls: ['./product-geo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductGeoComponent implements OnInit {
  @Input({ required: true }) type: ProductGeoType;

  faq$: Observable<FaqEntry[]>;
  howTo$: Observable<SchemaHowTo>;

  private context = inject(ProductContextFacade);

  ngOnInit() {
    if (this.type === 'faq') {
      this.faq$ = this.context.select('product').pipe(
        map(
          product =>
            ProductHelper.getAttributesOfGroup(product, AttributeGroupTypes.ProductGeoAttributes) as Attribute<string>[]
        ),
        map(geo => AttributeHelper.getAttributeByAttributeName(geo, 'GEO_FAQ')?.value as string),
        map(geoFaq => GeoHelper.parseFaq(geoFaq)),
        shareReplay(1)
      );
    } else if (this.type === 'howto') {
      this.howTo$ = this.context.select('product').pipe(
        map(
          product =>
            ProductHelper.getAttributesOfGroup(product, AttributeGroupTypes.ProductGeoAttributes) as Attribute<string>[]
        ),
        map(geo => AttributeHelper.getAttributeByAttributeName(geo, 'GEO_HOW_TO')?.value as string),
        map(geoHowTo => GeoHelper.parseGeoAttribute<SchemaHowTo>(geoHowTo)),
        shareReplay(1)
      );
    }
  }
}
