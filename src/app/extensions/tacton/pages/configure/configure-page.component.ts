import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { TactonFacade } from '../../facades/tacton.facade';

@Component({
  selector: 'ish-configure-page',
  templateUrl: './configure-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurePageComponent implements OnInit {
  state$: Observable<unknown>;
  tree$: Observable<unknown>;
  step$: Observable<unknown>;
  loading$: Observable<boolean>;
  product$: Observable<ProductView>;

  constructor(private tactonFacade: TactonFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.product$ = this.shoppingFacade.selectedProduct$;
    this.state$ = this.tactonFacade.configureProduct$();
    this.tree$ = this.tactonFacade.configurationTree$;
    this.step$ = this.tactonFacade.currentStep$;
    this.loading$ = this.tactonFacade.loading$;
  }
}
