import { ChangeDetectionStrategy, Component, ContentChild, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IntersectionStatus } from 'ish-core/directives/intersection-observer.directive';
import { LazyLoadingContentDirective } from 'ish-core/directives/lazy-loading-content.directive';

@Component({
  selector: 'ish-lazy-item',
  templateUrl: './lazy-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyItemComponent {
  @ContentChild(LazyLoadingContentDirective) lazyContent: LazyLoadingContentDirective;
  @Input() cssClass: string;

  visible$ = new BehaviorSubject<boolean>(false);

  onVisibilityChange(event: IntersectionStatus) {
    if (event === 'Visible') {
      this.visible$.next(true);
    }
  }
}
