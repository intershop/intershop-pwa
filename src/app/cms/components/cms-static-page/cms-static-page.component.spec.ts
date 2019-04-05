import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentPageletView, createContentPageletView } from 'ish-core/models/content-view/content-views';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { CMSStaticPageComponent } from './cms-static-page.component';

describe('Cms Static Page Component', () => {
  let component: CMSStaticPageComponent;
  let fixture: ComponentFixture<CMSStaticPageComponent>;
  let element: HTMLElement;
  let pageletView: ContentPageletView;
  let pagelet: ContentPagelet;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CMSStaticPageComponent,
        MockComponent({
          selector: 'ish-content-slot',
          template: 'Content Slot Container',
          inputs: ['slot', 'pagelet'],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSStaticPageComponent);
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
