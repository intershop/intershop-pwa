import { ChangeDetectionStrategy, Component, DoCheck, Input } from '@angular/core';

import { ContentPageletView } from '../../../models/content-view/content-views';
import { arraySlices } from '../../../utils/functions';

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

  ngDoCheck() {
    if (this.pagelet.hasParam('SlideItems')) {
      this.slideItems = this.pagelet.numberParam('SlideItems');
    }
    this.itemGridSize = (12 - (12 % this.slideItems)) / this.slideItems;
    this.pageletSlides = this.generateSlides();
    this.intervalValue = this.getIntervalValue();
  }

  generateSlides(): ContentPageletView[][] {
    const slotPagelets = this.pagelet.slot('app_sf_responsive_cm:slot.carousel.items.pagelet2-Slot').pagelets();
    return arraySlices(slotPagelets, this.slideItems);
  }

  getIntervalValue(): number {
    if (this.pagelet.booleanParam('StartCycling')) {
      return this.pagelet.numberParam('SlideInterval', 5000);
    } else {
      return 0;
    }
  }
}
