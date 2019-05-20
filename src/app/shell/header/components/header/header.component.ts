import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { LARGE_BREAKPOINT_WIDTH, MEDIUM_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';

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
export class HeaderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isSticky = false;

  navbarCollapsed = false;
  showSearch = false;
  screenHeight: number;
  mobileStickyHeaderHeight = 40;

  viewStatus: 'mobile' | 'tablet' | 'pc';

  private destroy$ = new Subject();

  constructor(
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: number,
    @Inject(LARGE_BREAKPOINT_WIDTH) private largeBreakpointWidth: number,
    @Inject(PLATFORM_ID) private platformId: string,
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.determineDevice();
      this.navbarCollapsed = this.viewStatus === 'mobile';
    }

    // collapse mobile menu on router navigation start event
    // TODO: check testing and router subscription vs. ngrx state handling
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (isPlatformBrowser(this.platformId) && window.innerWidth < this.mediumBreakpointWidth) {
          this.navbarCollapsed = true;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewStatus === 'tablet' && changes.isSticky.previousValue !== changes.isSticky.currentValue) {
      this.navbarCollapsed = changes.isSticky.currentValue;
    }
  }

  @HostListener('window:resize', ['$event'])
  mobileViewHandler(event) {
    this.determineDevice();

    if (this.isSticky) {
      this.collapseIf(['mobile', 'tablet']);
    } else {
      this.collapseIf(['mobile']);
    }
    this.screenHeight = event.target.innerHeight - this.mobileStickyHeaderHeight;
  }

  collapseIf(viewTypes: string[]): void {
    this.navbarCollapsed = viewTypes.includes(this.viewStatus);
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }

  determineDevice() {
    if (window.innerWidth < this.mediumBreakpointWidth) {
      this.viewStatus = 'mobile';
    } else if (window.innerWidth < this.largeBreakpointWidth) {
      this.viewStatus = 'tablet';
    } else {
      this.viewStatus = 'pc';
    }
  }
}
