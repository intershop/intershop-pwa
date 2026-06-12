import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentViewHelper } from 'ish-core/models/content-view/content-view.helper';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-navigation-link',
  templateUrl: './cms-navigation-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSNavigationLinkComponent implements CMSComponent {
  @Input({ required: true }) pagelet: ContentPageletView;

  opened = false;

  isRouterLink = ContentViewHelper.isRouterLink;
  routerLink = ContentViewHelper.getRouterLink;

  subMenuShow(subMenu: HTMLElement) {
    subMenu.classList.add('hover');
  }

  subMenuHide(subMenu: HTMLElement) {
    subMenu.classList.remove('hover');
  }

  toggleOpen() {
    this.opened = !this.opened;
  }
}
