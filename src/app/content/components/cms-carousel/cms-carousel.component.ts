import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { ContentPageletView } from '../../../models/content-view/content-views';

// tslint:disable-next-line:project-structure
@Component({
  selector: 'ish-cms-carousel',
  templateUrl: './cms-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSCarouselComponent implements OnChanges {
  @Input()
  pagelet: ContentPageletView;

  slideItems = 6;
  itemGridSize = 12;
  pageletSlides: ContentPageletView[][] = [];
  intervalValue = 0;

  ngOnChanges() {
    if (this.pagelet.hasParam('SlideItems')) {
      this.slideItems = this.pagelet.numberParam('SlideItems');
    }
    this.itemGridSize = (12 - (12 % this.slideItems)) / this.slideItems;
    this.pageletSlides = this.generateSlides();
    this.intervalValue = this.getIntervalValue();
  }

  generateSlides(): ContentPageletView[][] {
    const slotPagelets = this.pagelet.slot('app_sf_responsive_cm:slot.carousel.items.pagelet2-Slot').pagelets();
    let slidePagelets = [];
    const slides = [];

    slotPagelets.map((pagelet, index) => {
      slidePagelets.push(pagelet);
      if ((index % this.slideItems) + 1 === this.slideItems) {
        slides.push(slidePagelets);
        slidePagelets = [];
      }
    });
    return slides;
  }

  getIntervalValue(): number {
    if (this.pagelet.booleanParam('StartCycling')) {
      return this.pagelet.numberParam('SlideInterval', 5000);
    } else {
      return 0;
    }
  }
}
