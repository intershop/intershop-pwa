import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { CompareFacade } from '../../facades/compare.facade';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ish-product-send-to-compare',
  templateUrl: './product-send-to-compare.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, FontAwesomeModule, TranslateModule],
})
@GenerateLazyComponent()
export class ProductSendToCompareComponent {
  constructor(private context: ProductContextFacade, private compareFacade: CompareFacade) {}

  addToCompare() {
    this.compareFacade.addProductToCompare(this.context.get('sku'));
  }
}
