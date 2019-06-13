import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getDeviceType, getHeaderType } from 'ish-core/store/viewconf';

@Component({
  selector: 'ish-header-container',
  templateUrl: './header.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderContainerComponent {
  headerType$ = this.store.pipe(select(getHeaderType));
  deviceType$ = this.store.pipe(select(getDeviceType));
  headerType = '';
  isSticky = false;

  constructor(private store: Store<{}>) {}

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.headerType$.subscribe(value => (this.headerType = value));
    this.isSticky = window.pageYOffset >= 170;
    // TODO: use a store value here as it is done with wrapperClass (app component)
    if (this.isSticky && this.headerType !== 'simple' && this.headerType !== 'checkout') {
      document.getElementsByTagName('header')[0].parentElement.classList.add('sticky-header');
    } else {
      document.getElementsByTagName('header')[0].parentElement.classList.remove('sticky-header');
    }
  }
}
