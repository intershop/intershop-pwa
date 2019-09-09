import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentPageletView, createContentPageletView } from 'ish-core/models/content-view/content-view.model';

import { ContentSlotContainerComponent } from '../../containers/content-slot/content-slot.container';

import { CMSStaticPageComponent } from './cms-static-page.component';

describe('Cms Static Page Component', () => {
  let component: CMSStaticPageComponent;
  let fixture: ComponentFixture<CMSStaticPageComponent>;
  let element: HTMLElement;
  let pageletView: ContentPageletView;
  let pagelet: ContentPagelet;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CMSStaticPageComponent, MockComponent(ContentSlotContainerComponent)],
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
