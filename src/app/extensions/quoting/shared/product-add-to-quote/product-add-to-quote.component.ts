import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DiscardChangesGuard } from 'ish-core/guards/discard-changes.guard';
import { Product } from 'ish-core/models/product/product.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

/**
 * The Product Add To Quote Container Component displays a button which adds a product to a Quote Request.
 * It provides two display types, text and icon.
 */
@Component({
  selector: 'ish-product-add-to-quote',
  templateUrl: './product-add-to-quote.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductAddToQuoteComponent implements OnInit {
  @Input() product: Product;
  @Input() disabled?: boolean;
  @Input() displayType?: 'icon' | 'link' = 'link';
  @Input() class?: string;
  @Input() quantity?: number;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    if (this.activatedRoute.routeConfig) {
      this.activatedRoute.routeConfig.canDeactivate = [DiscardChangesGuard];
    }
  }

  addToQuote() {
    const quantity = this.quantity ? this.quantity : this.product.minOrderQuantity;
    const sku = this.product.sku;
    this.router.navigate(['/account/quotes/addProductToQuoteRequest'], { queryParams: { sku, quantity } });
  }
}
