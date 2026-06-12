import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-navigation-category',
  templateUrl: './cms-navigation-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSNavigationCategoryComponent implements CMSComponent, OnChanges {
  @Input({ required: true }) pagelet: ContentPageletView;

  categoryTree$: Observable<NavigationCategory>;

  private openedCategories: string[] = [];

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnChanges(): void {
    if (this.pagelet?.hasParam('Category')) {
      this.categoryTree$ = this.shoppingFacade.navigationCategoryTree$(
        this.pagelet.stringParam('Category'),
        this.pagelet.numberParam('SubNavigationDepth', 0)
      );
    }
  }

  showSubMenu(childCount: number) {
    return (this.pagelet.hasParam('SubNavigationDepth') &&
      this.pagelet.numberParam('SubNavigationDepth') > 0 &&
      childCount) ||
      this.pagelet.hasParam('SubNavigationHTML')
      ? true
      : false;
  }

  subMenuShow(subMenu: HTMLElement) {
    subMenu.classList.add('hover');
  }

  subMenuHide(subMenu: HTMLElement) {
    subMenu.classList.remove('hover');
  }

  /**
   * Indicate if specific content page is expanded.
   */
  isOpened(uniqueId: string): boolean {
    return this.openedCategories.includes(uniqueId);
  }

  /**
   * Toggle content page open state.
   */
  toggleOpen(uniqueId: string) {
    const index = this.openedCategories.findIndex(id => id === uniqueId);
    index > -1 ? this.openedCategories.splice(index, 1) : this.openedCategories.push(uniqueId);
  }
}
