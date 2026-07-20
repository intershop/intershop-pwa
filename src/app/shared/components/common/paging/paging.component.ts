import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';

// maximum number of pages to display in the pagination component per device type
const MAX_SIZE: Readonly<Record<'desktop' | 'mobile', number>> = {
  mobile: 3,
  desktop: 5,
};

@Component({
  selector: 'ish-paging',
  standalone: false,
  templateUrl: './paging.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagingComponent {
  @Input({ required: true }) currentPage: number;
  @Input({ required: true }) lastPage: number;

  @Output() readonly goToPage: EventEmitter<number> = new EventEmitter<number>();

  maxSize$: Observable<number> = this.appFacade.deviceType$.pipe(
    map(deviceType => (deviceType === 'mobile' ? MAX_SIZE.mobile : MAX_SIZE.desktop))
  );

  constructor(
    private scroller: ViewportScroller,
    private appFacade: AppFacade
  ) {}

  /**
   * If the user changes the page the goToPage event is emitted
   *
   * @param page : changed page number
   */
  setPage(page: number) {
    this.goToPage.emit(page);
    this.scroller.scrollToPosition([0, 0]);
  }
}
