import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { IconModule } from 'ish-core/icon.module';
import { TranslateModule } from '@ngx-translate/core';

/**
 * The Product Add To Quote Component displays a button which adds a product to a Quote Request.
 * It provides two display types, text and icon.
 */
@Component({
  selector: 'ish-product-add-to-quote',
  templateUrl: './product-add-to-quote.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, NgClass, IconModule, TranslateModule],
})
export class ProductAddToQuoteComponent implements OnInit {
  @Input() displayType: 'icon' | 'link' = 'link';
  @Input() cssClass: string;
  /**
   * hidden for screen readers
   */
  @Input() ariaHidden = false;

  disabled$: Observable<boolean>;
  visible$: Observable<boolean>;

  constructor(
    private router: Router,
    private context: ProductContextFacade
  ) {}

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
