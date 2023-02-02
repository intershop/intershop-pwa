import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { navigationItems } from './account-navigation.items';

interface NavigationItem {
  localizationKey: string;
  dataTestingId?: string;
  feature?: string;
  serverSetting?: string;
  permission?: string | string[];
  notRole?: string | string[];
  faIcon?: IconProp;
  isCollapsed?: boolean;
  children?: NavigationItems;
}

export interface NavigationItems {
  [link: string]: NavigationItem;
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
  navigationItems: NavigationItems = navigationItems;

  activeClass = 'active';

  @ViewChildren(RouterLinkActive, { read: ElementRef }) activeElementRefs: QueryList<ElementRef>;

  constructor(private router: Router) {}

  // after view init open the navigation group of the active navigation item
  ngAfterViewInit() {
    // needs to be asynchronous otherwise it would be triggered to early
    setTimeout(() => {
      this.activeElementRefs
        .toArray()
        // find the active element
        .find(e => e.nativeElement.classList.contains(this.activeClass))
        // navigate through the DOM tree to the appropriate parent sibling
        ?.nativeElement?.parentElement?.parentElement?.previousSibling?.click();
    }, 0);
  }

  toggleCollapse(item: NavigationItem) {
    item.isCollapsed = !item.isCollapsed;
  }

  navigateTo(target: EventTarget) {
    if (target) {
      this.router.navigateByUrl((target as HTMLDataElement).value);
    }
  }

  get unsorted() {
    return () => 0;
  }

  isSelected(itemValueLink: string): string {
    return itemValueLink === location.pathname ? 'selected' : undefined;
  }
}
