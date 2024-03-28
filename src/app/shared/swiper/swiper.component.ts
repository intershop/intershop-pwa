import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  Input,
  NgZone,
  OnInit,
  QueryList,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';

import { SwiperSlideDirective } from './swiper-slide.directive';

@Component({
  selector: 'ish-swiper',
  templateUrl: './swiper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./swiper.component.scss'],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { ngSkipHydration: 'true' },
})
export class SwiperComponent implements OnInit, AfterViewInit {
  @Input() config: SwiperOptions;

  currentConfig: SwiperOptions;

  @ViewChild('swiper') swiperEl: ElementRef;

  initialSlides$: Observable<SwiperSlideDirective[]>;

  private destroyRef = inject(DestroyRef);

  constructor(private changeDetectorRef: ChangeDetectorRef, private zone: NgZone) {}

  @ContentChildren(SwiperSlideDirective, { descendants: false, emitDistinctChangesOnly: true })
  slidesEl: QueryList<SwiperSlideDirective>;

  private slides: SwiperSlideDirective[];

  get activeSlides() {
    return this.slides;
  }

  ngOnInit(): void {
    this.currentConfig = {
      ...this.config,
      injectStyles: [
        `
        .swiper {
          padding-bottom: 20px;
        }
        .swiper-slide {
          padding-right: $space-default;
          padding-left: $space-default;
        }

        .swiper-button-next,
        .swiper-button-prev {
          position: absolute;
          top: 0;
          z-index: 10;
          width: var(--swiper-navigation-icon-width);
          height: 100%;
          cursor: pointer;
          background: no-repeat 50% / 100% 100%;
          opacity: 0.5;

          &:hover {
            opacity: 1;
          }

          &.swiper-button-disabled {
            opacity: 0;
          }
        }
        .swiper-button-next {
          background-image: var(--swiper-navigation-next-icon-bg);
        }
        .swiper-button-prev {
          background-image: var(--swiper-navigation-prev-icon-bg);
        }
        .swiper-button-next svg,.swiper-button-prev svg {
          display:none;
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          content: "";
        }
        `,
      ],
    };
  }

  ngAfterViewInit() {
    if (!SSR) {
      this.zone.runOutsideAngular(() => {
        this.childrenSlidesInit();

        // eslint-disable-next-line ban/ban
        Object.assign(this.swiperEl.nativeElement, this.currentConfig);

        this.swiperEl?.nativeElement?.initialize();
      });

      this.changeDetectorRef.detectChanges();
    }
  }

  get swiper(): Swiper {
    return this.swiperEl?.nativeElement?.swiper;
  }

  private childrenSlidesInit() {
    this.slidesChanges(this.slidesEl);
    this.slidesEl.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(this.slidesChanges);
  }

  private slidesChanges = (val: QueryList<SwiperSlideDirective>) => {
    this.slides = val.map((slide: SwiperSlideDirective, _index: number) => slide);

    this.zone.run(() => {
      this.changeDetectorRef.detectChanges();
      this.swiper?.slideTo(0, 0);
    });
  };
}
