import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { AsyncPipe, NgClass, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * The Product Label Component renders a label for a product with label information, i.a. new, sale or top seller.
 */
@Component({
  selector: 'ish-product-label',
  templateUrl: './product-label.component.html',
  styleUrls: ['./product-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, NgClass, NgSwitch, TranslateModule, NgSwitchCase],
})
export class ProductLabelComponent implements OnInit {
  productLabel$: Observable<string>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.productLabel$ = this.context.select('label');
  }
}
