import { ChangeDetectionStrategy, Component, DoCheck, Input } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { arraySlices } from '../../../functions';

@Component({
  selector: 'ish-cms-carousel',
  templateUrl: './cms-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSCarouselComponent implements DoCheck {
  @Input()
  pagelet: ContentPageletView;

  slideItems = 6;
  itemGridSize = 12;
  pageletSlides: ContentPageletView[][] = [];
  intervalValue = 0;

  private initialized: boolean;

  ngDoCheck() {
    if (!this.initialized && this.pagelet) {
      if (this.pagelet.hasParam('SlideItems')) {
        this.slideItems = this.pagelet.numberParam('SlideItems');
      }
      this.itemGridSize = (12 - (12 % this.slideItems)) / this.slideItems;

      const slotPagelets = this.pagelet.slot('app_sf_responsive_cm:slot.carousel.items.pagelet2-Slot').pagelets();
      this.pageletSlides = arraySlices(slotPagelets, this.slideItems);

      this.intervalValue = this.pagelet.booleanParam('StartCycling')
        ? this.pagelet.numberParam('SlideInterval', 5000)
        : 0;

      this.initialized = true;
    }
  }
}
