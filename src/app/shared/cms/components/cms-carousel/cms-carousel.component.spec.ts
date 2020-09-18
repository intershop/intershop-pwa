import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { MockComponent } from 'ng-mocks';

import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ContentPageletComponent } from 'ish-shared/cms/components/content-pagelet/content-pagelet.component';
import { ContentSlotComponent } from 'ish-shared/cms/components/content-slot/content-slot.component';

import { CMSCarouselComponent } from './cms-carousel.component';

describe('Cms Carousel Component', () => {
  let component: CMSCarouselComponent;
  let fixture: ComponentFixture<CMSCarouselComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CMSCarouselComponent, MockComponent(ContentPageletComponent), MockComponent(ContentSlotComponent)],
      imports: [NgbCarouselModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSCarouselComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
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
          displayName: 'test',
          definitionQualifiedName: 'app_sf_base_cm:slot.carousel.items.pagelet2-Slot',
          pageletIDs: ['slide1', 'slide2'],
        },
      ],
    };
    component.pagelet = createContentPageletView(pagelet);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
