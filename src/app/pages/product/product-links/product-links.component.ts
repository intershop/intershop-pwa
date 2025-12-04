import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductLinksDictionary } from 'ish-core/models/product-links/product-links.model';
import { TranslateModule } from '@ngx-translate/core';
import { ProductLinksCarouselComponent as ProductLinksCarouselComponent_1 } from '../product-links-carousel/product-links-carousel.component';
import { ProductLinksListComponent } from '../product-links-list/product-links-list.component';
import { NgIf, AsyncPipe } from '@angular/common';

/**
 * The Product Links Component
 *
 * Collects all types of product links and prepares their rendering.
 * Product links can be displayed as product list (uses {@link ProductLinkListComponent}) or product carousel (uses  {@link ProductLinksCarouselComponent}).
 * For the carousel swiper is used.
 *
 * @example
 * <ish-product-links />
 */
@Component({
    selector: 'ish-product-links',
    templateUrl: './product-links.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        ProductLinksListComponent,
        ProductLinksCarouselComponent_1,
        AsyncPipe,
        TranslateModule,
    ],
})
export class ProductLinksComponent implements OnInit {
  links$: Observable<ProductLinksDictionary>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.links$ = this.context.select('links');
  }
}
