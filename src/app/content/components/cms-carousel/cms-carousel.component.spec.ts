import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';
import { MockComponent } from '../../../utils/dev/mock.component';

import { CMSCarouselComponent } from './cms-carousel.component';

describe('Cms Carousel Component', () => {
  let component: CMSCarouselComponent;
  let fixture: ComponentFixture<CMSCarouselComponent>;
  let element: HTMLElement;
  let pagelet: ContentPagelet;

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
    pagelet = {
      definitionQualifiedName: 'fq',
      displayName: 'name',
      id: 'id',
      configurationParameters: {
        CSSClass: 'foo-class',
      },
      slots: [
        {
          definitionQualifiedName: 'fq',
          pageletIDs: [],
        },
      ],
    };
    component.pagelet = pagelet;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
