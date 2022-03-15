import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

@Component({
  selector: 'ish-compare-page',
  templateUrl: './compare-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparePageComponent implements OnInit {
  compareProducts$: Observable<string[]>;
  compareProductsCount$: Observable<number>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.compareProducts$ = this.shoppingFacade.compareProducts$;
    this.compareProductsCount$ = this.shoppingFacade.compareProductsCount$;
  }
}
