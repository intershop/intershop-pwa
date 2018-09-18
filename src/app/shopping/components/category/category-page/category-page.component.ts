import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';

import { MEDIUM_BREAKPOINT_WIDTH } from '../../../../core/configurations/injection-keys';
import { CategoryView } from '../../../../models/category-view/category-view.model';

@Component({
  selector: 'ish-category-page',
  templateUrl: './category-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryPageComponent implements OnInit {
  @Input()
  category: CategoryView;

  isCollapsed = false;

  constructor(
    @Inject(MEDIUM_BREAKPOINT_WIDTH) private mediumBreakpointWidth: number,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isCollapsed = window.innerWidth < this.mediumBreakpointWidth;
    }
  }

  @HostListener('window:resize', ['$event'])
  mobileViewHandler(event) {
    this.isCollapsed = event.target.innerWidth < this.mediumBreakpointWidth;
  }
}
