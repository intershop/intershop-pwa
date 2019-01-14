import { ChangeDetectionStrategy, Component, OnChanges } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { arraySlices } from 'ish-core/utils/functions';
import { CMSComponentBase } from '../cms-component-base/cms-component-base';

@Component({
  selector: 'ish-cms-carousel',
  templateUrl: './cms-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSCarouselComponent extends CMSComponentBase implements OnChanges {
  slideItems = 6;
  itemGridSize = 12;
  pageletSlides: ContentPageletView[][] = [];
  intervalValue = 0;

  ngOnChanges() {
    if (this.pagelet.hasParam('SlideItems')) {
      this.slideItems = this.pagelet.numberParam('SlideItems');
    }
    this.itemGridSize = (12 - (12 % this.slideItems)) / this.slideItems;

    const slotPagelets = this.pagelet.slot('app_sf_responsive_cm:slot.carousel.items.pagelet2-Slot').pagelets();
    this.pageletSlides = arraySlices(slotPagelets, this.slideItems);

    this.intervalValue = this.pagelet.booleanParam('StartCycling')
      ? this.pagelet.numberParam('SlideInterval', 5000)
      : 0;
  }
}
