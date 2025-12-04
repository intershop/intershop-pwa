import { NgClass } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ContentPageletComponent } from 'ish-shared/cms/components/content-pagelet/content-pagelet.component';
import { ContentSlotComponent } from 'ish-shared/cms/components/content-slot/content-slot.component';

import { CMSContainerComponent } from './cms-container.component';

describe('Cms Container Component', () => {
  let component: CMSContainerComponent;
  let fixture: ComponentFixture<CMSContainerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CMSContainerComponent],
    })
      .overrideComponent(CMSContainerComponent, {
        set: {
          imports: [MockComponent(ContentPageletComponent), MockComponent(ContentSlotComponent), NgClass],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSContainerComponent);
    component = fixture.componentInstance;
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
          displayName: 'test',
          definitionQualifiedName: 'app_sf_base_cm:slot.container.content.pagelet2-Slot',
          pageletIDs: ['slide1', 'slide2'],
        },
      ],
    };
    component.pagelet = createContentPageletView(pagelet);
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('.content-container')).toBeTruthy();
    expect(element.querySelector('ish-content-slot')).toBeTruthy();
  });
});
