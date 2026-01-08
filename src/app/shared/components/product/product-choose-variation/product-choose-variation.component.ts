import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-choose-variation',
  templateUrl: './product-choose-variation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgIf, TranslateModule],
})
export class ProductChooseVariationComponent implements OnInit {
  visible$: Observable<number>;
  productURL$: Observable<string>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('variationCount');
    this.productURL$ = this.context.select('productURL');
  }
}
