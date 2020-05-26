import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-lazy-create-order-template',
  templateUrl: './lazy-create-order-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyCreateOrderTemplateComponent {
  @Input() products: Product[];
  @Input() class?: string;
  componentLocation = {
    moduleId: 'ish-extensions-order-templates',
    selector: 'ish-basket-create-order-template',
  };
}
