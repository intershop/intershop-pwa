import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { createPageletView } from '../../../models/content-view/content-views';
import { PipesModule } from '../../../shared/pipes.module';
import { MockComponent } from '../../../utils/dev/mock.component';

import { CMSContainerComponent } from './cms-container.component';

describe('Cms Container Component', () => {
  let component: CMSContainerComponent;
  let fixture: ComponentFixture<CMSContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CMSContainerComponent,
        MockComponent({ selector: 'ish-content-pagelet', template: 'Content Pagelet', inputs: ['pagelet'] }),
      ],
      imports: [PipesModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSContainerComponent);
    component = fixture.componentInstance;
    const slide1 = {
      definitionQualifiedName: 'fq',
      displayName: 'name',
      id: 'slide1',
      configurationParameters: {},
      slots: [],
    };
    const slide2 = {
      definitionQualifiedName: 'fq',
      displayName: 'name',
      id: 'slide2',
      configurationParameters: {},
      slots: [],
    };
    const pagelet = {
      definitionQualifiedName: 'fq',
      displayName: 'name',
      id: 'id',
      configurationParameters: {
        CSSClass: 'foo-class',
        Grid: 'ExtraSmall:12,Small:6,Medium:4,Large:0',
      },
      slots: [
        {
          definitionQualifiedName: 'app_sf_responsive_cm:slot.container.content.pagelet2-Slot',
          pageletIDs: [slide1.id, slide2.id],
          configurationParameters: {},
        },
      ],
    };
    component.pagelet = createPageletView(pagelet.id, {
      [pagelet.id]: pagelet,
      [slide1.id]: slide1,
      [slide2.id]: slide2,
    });
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
