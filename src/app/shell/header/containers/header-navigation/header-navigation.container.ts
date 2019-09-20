import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';

@Component({
  selector: 'ish-header-navigation-container',
  templateUrl: './header-navigation.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNavigationContainerComponent implements OnInit {
  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  categories$: Observable<CategoryView[]>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.categories$ = this.shoppingFacade.topLevelCategories$;
  }
}
