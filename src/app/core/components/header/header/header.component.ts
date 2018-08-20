import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { MEDIUM_BREAKPOINT_WIDTH } from '../../../configurations/injection-keys';

/**
 * The Header Component displays the page header.
 *
 * It uses the {@link LoginStatusContainerComponent} for rendering the users login status.
 * It uses the {@link ProductCompareStatusContainerComponent} for rendering the product compare button and count.
 * It uses the {@link MobileBasketContainerComponent} for rendering the mobile basket button and basket item count.
 * It uses the {@link LanguageSwitchContainerComponent} for rendering the language selection dropdown.
 * It uses the {@link SearchBoxContainerComponent} for rendering the search box.
 * It uses the {@link HeaderNavigationContainerComponent} for rendering the pages main navigation.
 * It uses the {@link MiniBasketContainerComponent} for rendering mini basket on desktop sized viewports.
 *
 * @example
 * <ish-header></ish-header>
 */
@Component({
  selector: 'ish-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  navbarCollapsed = false;

  constructor(
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: number,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.navbarCollapsed = window.innerWidth < this.mediumBreakpointWidth;
    }
  }

  @HostListener('window:resize', ['$event'])
  mobileViewHandler(event) {
    this.navbarCollapsed = event.target.innerWidth < this.mediumBreakpointWidth;
  }
}
