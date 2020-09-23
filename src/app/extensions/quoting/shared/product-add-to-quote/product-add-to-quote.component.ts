import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

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
export class ProductAddToQuoteComponent {
  @Input() product: Product;
  @Input() disabled?: boolean;
  @Input() displayType?: 'icon' | 'link' = 'link';
  @Input() class?: string;
  @Input() quantity?: number;

  constructor(private router: Router) {}

  addToQuote() {
    const quantity = this.quantity ? this.quantity : this.product.minOrderQuantity;
    const sku = this.product.sku;
    this.router.navigate(['/addProductToQuoteRequest'], { queryParams: { sku, quantity } });
  }
}
