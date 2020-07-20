import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonNavigationTree } from '../../../models/tacton-navigation-tree/tacton-navigation-tree.model';

@Component({
  selector: 'ish-tacton-configure-navigation',
  templateUrl: './tacton-configure-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TactonConfigureNavigationComponent implements OnInit {
  product$: Observable<ProductView>;
  tree$: Observable<TactonNavigationTree>;
  groupLevelNavigationEnabled$: Observable<boolean>;

  constructor(private tactonFacade: TactonFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.product$ = this.shoppingFacade.selectedProduct$;
    this.tree$ = this.tactonFacade.configurationTree$;
    this.groupLevelNavigationEnabled$ = this.tactonFacade.groupLevelNavigationEnabled$;
  }
}
