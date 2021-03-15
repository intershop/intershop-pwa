import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';

@Component({
  selector: 'ish-header-navigation',
  templateUrl: './header-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNavigationComponent implements OnInit {
  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  categories$: Observable<NavigationCategory[]>;

  private openedCategories: string[] = [];

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.categories$ = this.shoppingFacade.navigationCategories$();
  }

  /**
   * Handle sub menu show.
   * Adds hover class to rendered element.
   * @param submenu The rendered sub menu element.
   */
  subMenuShow(submenu: HTMLElement) {
    submenu.classList.add('hover');
  }

  /**
   * Handle sub menu hide.
   * Removes hover class from rendered element.
   * @param submenu The rendered sub menu element.
   */
  subMenuHide(submenu: HTMLElement) {
    submenu.classList.remove('hover');
  }

  /**
   * Indicate if specific category is expanded.
   * @param category The category item.
   */
  isOpened(uniqueId: string): boolean {
    return this.openedCategories.includes(uniqueId);
  }

  /**
   * Toggle category open state.
   * @param category The category item.
   */
  toggleOpen(uniqueId: string) {
    const index = this.openedCategories.findIndex(id => id === uniqueId);
    index > -1 ? this.openedCategories.splice(index, 1) : this.openedCategories.push(uniqueId);
  }
}
