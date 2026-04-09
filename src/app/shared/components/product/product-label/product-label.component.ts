import { AsyncPipe, NgClass, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

/**
 * The Product Label Component renders a label for a product with label information, i.a. new, sale or top seller.
 */
@Component({
  selector: 'ish-product-label',
  templateUrl: './product-label.component.html',
  styleUrls: ['./product-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NgClass, NgSwitch, TranslatePipe, NgSwitchCase],
})
export class ProductLabelComponent implements OnInit {
  productLabel$: Observable<string>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.productLabel$ = this.context.select('label');
  }
}
