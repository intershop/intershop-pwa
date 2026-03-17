import { DOCUMENT, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { ProductCompareStatusComponent } from '../../../extensions/compare/shared/product-compare-status/product-compare-status.component';
import { QuickorderLinkComponent } from '../../../extensions/quickorder/shared/quickorder-link/quickorder-link.component';
import { WishlistsLinkComponent } from '../../../extensions/wishlists/shared/wishlists-link/wishlists-link.component';

import { FEATURE_TOGGLE_IMPORTS } from 'ish-core/feature-toggle';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { SearchBoxComponent as SearchBoxComponent_1 } from 'ish-shared/components/search/search-box/search-box.component';
import { HeaderNavigationComponent as HeaderNavigationComponent_1 } from 'ish-shell/header/header-navigation/header-navigation.component';
import { LanguageSwitchComponent as LanguageSwitchComponent_1 } from 'ish-shell/header/language-switch/language-switch.component';
import { LoginStatusComponent as LoginStatusComponent_1 } from 'ish-shell/header/login-status/login-status.component';
import { MiniBasketComponent as MiniBasketComponent_1 } from 'ish-shell/header/mini-basket/mini-basket.component';
import { UserInformationMobileComponent } from 'ish-shell/header/user-information-mobile/user-information-mobile.component';

type CollapsibleComponent = 'search' | 'navbar' | 'minibasket';

/**
 * The Header Component displays the page header.
 *
 * It uses the {@link LoginStatusComponent} for rendering the users login status.
 * It uses the {@link ProductCompareStatusComponent} for rendering the product compare button and count.
 * It uses the {@link MobileBasketComponent} for rendering the mobile basket button and basket item count.
 * It uses the {@link LanguageSwitchComponent} for rendering the language selection dropdown.
 * It uses the {@link SearchBoxComponent} for rendering the search box.
 * It uses the {@link HeaderNavigationComponent} for rendering the pages main navigation.
 * It uses the {@link MiniBasketComponent} for rendering mini basket on desktop sized viewports.
 *
 * @example
 * <ish-header></ish-header>
 */
@Component({
  selector: 'ish-header-default',
  templateUrl: './header-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SearchBoxComponent_1,
    NgClass,
    LoginStatusComponent_1,
    ProductCompareStatusComponent,
    QuickorderLinkComponent,
    WishlistsLinkComponent,
    ...FEATURE_TOGGLE_IMPORTS,
    NgbCollapseModule,
    NgTemplateOutlet,
    LanguageSwitchComponent_1,
    MiniBasketComponent_1,
    RouterLink,
    HeaderNavigationComponent_1,
    UserInformationMobileComponent,
    TranslatePipe],
})
export class HeaderDefaultComponent implements OnChanges {
  @Input() isSticky = false;
  @Input() deviceType: DeviceType;
  // not-dead-code
  @Input() reset: unknown;

  private activeComponent: CollapsibleComponent = 'search';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.reset) {
      this.activeComponent = 'search';
    }
    this.toggleSpecialStatusOfSearch();
  }

  get showSearch() {
    return (
      this.activeComponent === 'search' &&
      // always show for sticky header
      (this.deviceType === 'mobile' || this.isSticky)
    );
  }

  get showNavBar() {
    return (
      this.activeComponent === 'navbar' ||
      // always show for desktop
      this.deviceType === 'desktop' ||
      // always show for tablet on top
      (this.deviceType === 'tablet' && !this.isSticky)
    );
  }

  get showDesktopLogoLink() {
    return (!this.isSticky && this.deviceType === 'tablet') || this.deviceType === 'desktop';
  }

  get showMobileLogoLink() {
    return (this.isSticky && this.deviceType !== 'desktop') || this.deviceType === 'mobile';
  }

  private toggleSpecialStatusOfSearch() {
    // deactivate search when switching to sticky header
    if (this.isSticky && this.activeComponent === 'search') {
      this.activeComponent = undefined;
    }
    // activate search when scrolling to top and no other is active
    if (!this.isSticky && !this.activeComponent) {
      this.activeComponent = 'search';
    }
  }

  toggle(component: CollapsibleComponent) {
    if (this.activeComponent === component) {
      // activate search bar when on top and no other is active
      this.activeComponent = !this.isSticky ? 'search' : undefined;
    } else {
      this.activeComponent = component;

      if (component === 'search') {
        this.focusSearch();
      }
    }
  }

  // scroll to the top and set focus to search input
  scrollTopAndFocusSearch() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const checkInterval = setInterval(() => {
      if (window.scrollY === 0) {
        // wait until page has scrolled to top
        clearInterval(checkInterval);
        this.focusSearch();
      }
    }, 500);
  }

  private focusSearch() {
    this.document.getElementById('header-search-input').focus();
  }
}

