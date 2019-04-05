import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { createContentPageletView } from 'ish-core/models/content-view/content-views';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { CMSCarouselComponent } from './cms-carousel.component';

describe('Cms Carousel Component', () => {
  let component: CMSCarouselComponent;
  let fixture: ComponentFixture<CMSCarouselComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CMSCarouselComponent,
        MockComponent({
          selector: 'ish-content-slot-wrapper',
          template: 'outlet',
          inputs: ['pagelet', 'slot'],
        }),
        MockComponent({ selector: 'ish-content-pagelet', template: 'Content Pagelet', inputs: ['pagelet'] }),
      ],
      imports: [NgbCarouselModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSCarouselComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    const slide1 = {
      id: 'slide1',
      domain: 'domain',
      displayName: 'slide1',
      definitionQualifiedName: 'fq',
    };
    const slide2 = {
      id: 'slide2',
      domain: 'domain',
      displayName: 'slide2',
      definitionQualifiedName: 'fq',
    };

    const pagelet = {
      id: 'id',
      definitionQualifiedName: 'fq',
      domain: 'domain',
      displayName: 'pagelet',
      configurationParameters: {
        CSSClass: 'foo-class',
        SlideItems: 2,
      },
      slots: [
        {
          definitionQualifiedName: 'app_sf_responsive_cm:slot.carousel.items.pagelet2-Slot',
          pageletIDs: [slide1.id, slide2.id],
        },
      ],
    };
    component.pagelet = createContentPageletView(pagelet.id, {
      [pagelet.id]: pagelet,
      [slide1.id]: slide1,
      [slide2.id]: slide2,
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
