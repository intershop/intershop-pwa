import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
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
  @Input() displayType?: 'icon' | 'link' = 'link';
  @Input() class?: string;

  disabled$: Observable<boolean>;
  visible$: Observable<boolean>;

  constructor(private router: Router, private context: ProductContextFacade) {}

  ngOnInit() {
    this.disabled$ = this.context.select('hasQuantityError');
    this.visible$ = this.context.select('displayProperties', 'addToQuote');
  }

  addToQuote() {
    this.router.navigate(['/addProductToQuoteRequest'], {
      queryParams: { sku: this.context.get('sku'), quantity: this.context.get('quantity') },
    });
  }
}
