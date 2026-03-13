import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { CompareFacade } from '../../facades/compare.facade';

@Component({
  selector: 'ish-product-send-to-compare',
  templateUrl: './product-send-to-compare.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, TranslatePipe],
})
export class ProductSendToCompareComponent {
  constructor(private context: ProductContextFacade, private compareFacade: CompareFacade) {}

  addToCompare() {
    this.compareFacade.addProductToCompare(this.context.get('sku'));
  }
}
