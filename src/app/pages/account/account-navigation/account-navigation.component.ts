import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { navigationItems } from './account-navigation.items';

export interface NavigationItem {
  id: string;
  localizationKey: string;
  routerLink?: string;
  faIcon?: IconProp;
  isCollapsed?: boolean;
  feature?: string;
  serverSetting?: string;
  permission?: string | string[];
  notRole?: string | string[];
  children?: NavigationItem[];
}

@Component({
  selector: 'ish-account-navigation',
  templateUrl: './account-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountNavigationComponent implements AfterViewInit {
  @Input() deviceType: DeviceType;

  /**
   * Manages the Account Navigation items.
   */
  navigationItems: NavigationItem[] = navigationItems;

  activeClass = 'active';

  constructor(private router: Router, private elem: ElementRef) {}

  // after view init open the navigation parent of the active navigation item
  ngAfterViewInit() {
    // needs to be asynchronous otherwise it would be triggered to early
    setTimeout(() => {
      // find the currently active navigation item and check for a navigation parent
      const navParent = this.elem.nativeElement.querySelector(`.${this.activeClass}`)?.dataset.navParent;
      if (navParent) {
        const navParentElem = this.elem.nativeElement.querySelector(`#${navParent}`);
        // check wether the navigation parent is already opened otherwise click the navigation parent to open it
        if (navParentElem && !(navParentElem.getAttribute('aria-expanded') === 'true')) {
          navParentElem.click();
        }
      }
    }, 0);
  }

  toggleCollapse(item: NavigationItem) {
    item.isCollapsed = !item.isCollapsed;
  }

  isSelected(item: NavigationItem): string {
    return item.routerLink === location.pathname ? 'selected' : undefined;
  }

  navigateTo(target: EventTarget) {
    if (target) {
      this.router.navigateByUrl((target as HTMLDataElement).value);
    }
  }
}
