import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { map, take } from 'rxjs/operators';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { arraySlices } from 'ish-core/utils/functions';
import { whenTruthy } from 'ish-core/utils/operators';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-carousel',
  templateUrl: './cms-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSCarouselComponent implements CMSComponent, OnChanges {
  @Input() pagelet: ContentPageletView;

  @ViewChild('ngbCarousel') carousel: NgbCarousel;

  slideItems = 6;
  itemGridSize = 12;
  pageletSlides: string[][] = [];

  constructor(private appRef: ApplicationRef) {}

  private destroyRef = inject(DestroyRef);

  ngOnChanges() {
    if (this.pagelet.hasParam('SlideItems')) {
      this.slideItems = this.pagelet.numberParam('SlideItems');
    }
    this.itemGridSize = (12 - (12 % this.slideItems)) / this.slideItems;

    const slotPagelets = this.pagelet.slot('app_sf_base_cm:slot.carousel.items.pagelet2-Slot').pageletIDs;
    this.pageletSlides = arraySlices(slotPagelets, this.slideItems);

    if (!SSR) {
      this.appRef.isStable
        .pipe(
          whenTruthy(),
          map(() => (this.pagelet.booleanParam('StartCycling') ? this.pagelet.numberParam('SlideInterval', 5000) : 0)),
          take(1),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(val => {
          if (val && this.carousel) {
            this.carousel.interval = val;
            this.carousel.cycle();
          }
        });
    }
  }
}
