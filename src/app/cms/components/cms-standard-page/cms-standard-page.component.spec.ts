import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentPageletView, createContentPageletView } from 'ish-core/models/content-view/content-views';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { CMSStandardPageComponent } from './cms-standard-page.component';

describe('Cms Standard Page Component', () => {
  let component: CMSStandardPageComponent;
  let fixture: ComponentFixture<CMSStandardPageComponent>;
  let element: HTMLElement;
  let pageletView: ContentPageletView;
  let pagelet: ContentPagelet;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CMSStandardPageComponent,
        MockComponent({
          selector: 'ish-content-slot',
          template: 'Content Slot Container',
          inputs: ['slot'],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSStandardPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    pagelet = {
      domain: 'domain',
      displayName: 'pagelet1',
      definitionQualifiedName: 'fq',
      id: 'id',
      configurationParameters: {},
    };
    pageletView = createContentPageletView(pagelet.id, { [pagelet.id]: pagelet });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    component.pagelet = pageletView;
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
