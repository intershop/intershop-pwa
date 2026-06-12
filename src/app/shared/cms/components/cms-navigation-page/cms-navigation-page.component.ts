import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-navigation-page',
  templateUrl: './cms-navigation-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSNavigationPageComponent implements CMSComponent, OnChanges {
  @Input({ required: true }) pagelet: ContentPageletView;

  pageTree$: Observable<ContentPageTreeView>;

  private openedPages: string[] = [];

  constructor(private cmsFacade: CMSFacade) {}

  ngOnChanges(): void {
    if (this.pagelet?.hasParam('Page')) {
      this.pageTree$ = this.cmsFacade.completeContentPageTree$(
        this.pagelet.stringParam('Page'),
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
    return this.openedPages.includes(uniqueId);
  }

  /**
   * Toggle content page open state.
   */
  toggleOpen(uniqueId: string) {
    const index = this.openedPages.findIndex(id => id === uniqueId);
    index > -1 ? this.openedPages.splice(index, 1) : this.openedPages.push(uniqueId);
  }
}
