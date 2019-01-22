import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { createContentPageletView } from 'ish-core/models/content-view/content-views';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { CMSContainerComponent } from './cms-container.component';

describe('Cms Container Component', () => {
  let component: CMSContainerComponent;
  let fixture: ComponentFixture<CMSContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CMSContainerComponent,
        MockComponent({
          selector: 'ish-content-pagelet',
          template: 'outlet',
          inputs: ['pagelet'],
        }),
        MockComponent({
          selector: 'ish-content-slot',
          template: 'Slot',
          inputs: ['pagelet', 'definitionQualifiedName'],
        }),
        MockComponent({
          selector: 'ish-slot-wrapper',
          template: 'outlet',
          inputs: ['pagelet', 'definitionQualifiedName'],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSContainerComponent);
    component = fixture.componentInstance;
    const slide1 = {
      definitionQualifiedName: 'fq',
      id: 'slide1',
      domain: 'domain',
      displayName: 'slide1',
    };
    const slide2 = {
      definitionQualifiedName: 'fq',
      id: 'slide2',
      domain: 'domain',
      displayName: 'slide2',
    };
    const pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      domain: 'domain',
      displayName: 'pagelet',
      configurationParameters: {
        CSSClass: 'foo-class',
        Grid: 'ExtraSmall:12,Small:6,Medium:4,Large:0',
      },
      slots: [
        {
          definitionQualifiedName: 'app_sf_responsive_cm:slot.container.content.pagelet2-Slot',
          pageletIDs: [slide1.id, slide2.id],
        },
      ],
    };
    component.pagelet = createContentPageletView(pagelet.id, {
      [pagelet.id]: pagelet,
      [slide1.id]: slide1,
      [slide2.id]: slide2,
    });
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchSnapshot();
  });
});
