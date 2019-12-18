import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';

@Component({
  selector: 'ish-header-navigation',
  templateUrl: './header-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNavigationComponent implements OnInit {
  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  categories$: Observable<CategoryView[]>;

  openedCategories = [];

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.categories$ = this.shoppingFacade.topLevelCategories$;
  }

  /**
   * Handle sub menu show.
   * Adds hover class to rendered element.
   * @param submenu The rendered sub menu element.
   */
  subMenuShow(submenu) {
    submenu.classList.add('hover');
  }

  /**
   * Handle sub menu hide.
   * Removes hover class from rendered element.
   * @param submenu The rendered sub menu element.
   */
  subMenuHide(submenu) {
    submenu.classList.remove('hover');
  }

  /**
   * Indicate if specific category is expanded.
   * @param category The category item.
   */
  isOpened(category: Category): boolean {
    return this.openedCategories.includes(category.uniqueId);
  }

  /**
   * Toggle category open state.
   * @param category The category item.
   */
  toggleOpen(category: Category) {
    const index = this.openedCategories.findIndex(id => id === category.uniqueId);
    index > -1 ? this.openedCategories.splice(index, 1) : this.openedCategories.push(category.uniqueId);
  }
}
