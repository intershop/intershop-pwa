import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { createPageletView } from '../../../models/content-view/content-views';
import { MockComponent } from '../../../utils/dev/mock.component';

import { CMSCarouselComponent } from './cms-carousel.component';

describe('Cms Carousel Component', () => {
  let component: CMSCarouselComponent;
  let fixture: ComponentFixture<CMSCarouselComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CMSCarouselComponent,
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
      definitionQualifiedName: 'fq',
      configurationParameters: {},
      slots: [],
    };
    const slide2 = {
      id: 'slide2',
      definitionQualifiedName: 'fq',
      configurationParameters: {},
      slots: [],
    };

    const pagelet = {
      id: 'id',
      definitionQualifiedName: 'fq',
      configurationParameters: {
        CSSClass: 'foo-class',
        SlideItems: 2,
      },
      slots: [
        {
          configurationParameters: {},
          definitionQualifiedName: 'app_sf_responsive_cm:slot.carousel.items.pagelet2-Slot',
          pageletIDs: [slide1.id, slide2.id],
        },
      ],
    };
    component.pagelet = createPageletView(pagelet.id, {
      [pagelet.id]: pagelet,
      [slide1.id]: slide1,
      [slide2.id]: slide2,
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
