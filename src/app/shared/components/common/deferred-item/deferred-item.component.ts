import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IntersectionStatus } from 'ish-core/directives/intersection-observer-util';
import { LazyLoadingContentDirective } from 'ish-core/directives/lazy-loading-content.directive';

/**
 * The Deferred Item Component
 *
 * Defers rendering of projected content until the element becomes visible in the viewport using IntersectionObserver.
 * Once rendered, the content remains in the DOM even when scrolled out of view.
 *
 * @example
 * <ish-deferred-item cssClass="col-6">
 *   <ng-template ishLazyLoadingContent>
 *     <!-- content to be lazily loaded -->
 *   </ng-template>
 * </ish-deferred-item>
 */
@Component({
  selector: 'ish-deferred-item',
  standalone: false,
  templateUrl: './deferred-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeferredItemComponent implements OnInit {
  @ContentChild(LazyLoadingContentDirective) lazyContent: LazyLoadingContentDirective;
  @Input() cssClass: string;

  visible$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    // In Cypress, skip lazy loading to avoid intersection observer timing issues with Swiper
    if (!SSR && typeof window !== 'undefined' && (window as { Cypress?: unknown }).Cypress) {
      this.visible$.next(true);
    }
  }

  onVisibilityChange(event: IntersectionStatus) {
    if (event === 'Visible') {
      this.visible$.next(true);
    }
  }
}
