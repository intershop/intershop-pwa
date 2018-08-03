import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { ContentPageletHelper } from '../../../models/content-pagelet/content-pagelet.helper';
import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';

// tslint:disable-next-line:project-structure
@Component({
  selector: 'ish-cms-carousel',
  templateUrl: './cms-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSCarouselComponent implements OnChanges {
  @Input()
  pagelet: ContentPagelet;

  getConfigurationParameterValue = ContentPageletHelper.getConfigurationParameterValue;

  slideItems = 6;
  itemGridSize = 12;
  pageletSlides: ContentPagelet[][] = [];
  intervalValue = 0;

  ngOnChanges() {
    if (this.getConfigurationParameterValue(this.pagelet, 'SlideItems', 'number')) {
      this.slideItems = this.getConfigurationParameterValue(this.pagelet, 'SlideItems', 'number');
    }
    this.itemGridSize = (12 - (12 % this.slideItems)) / this.slideItems;
    this.pageletSlides = this.generateSlides();
    this.intervalValue = this.getIntervalValue();
  }

  generateSlides(): ContentPagelet[][] {
    const slotPagelets = this.pagelet.slots['app_sf_responsive_cm:slot.carousel.items.pagelet2-Slot'].pagelets;
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
    if (this.getConfigurationParameterValue(this.pagelet, 'StartCycling', 'boolean')) {
      return this.getConfigurationParameterValue(this.pagelet, 'SlideInterval', 'number')
        ? this.getConfigurationParameterValue(this.pagelet, 'SlideInterval', 'number')
        : 5000;
    } else {
      return 0;
    }
  }
}
