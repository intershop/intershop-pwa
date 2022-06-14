import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentPageletView, createContentPageletView } from 'ish-core/models/content-view/content-view.model';

import { CMSLandingPageComponent } from './cms-landing-page.component';

describe('Cms Landing Page Component', () => {
  let component: CMSLandingPageComponent;
  let fixture: ComponentFixture<CMSLandingPageComponent>;
  let element: HTMLElement;
  let pageletView: ContentPageletView;
  let pagelet: ContentPagelet;

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSLandingPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    pagelet = {
      domain: 'domain',
      displayName: 'pagelet1',
      definitionQualifiedName: 'fq',
      id: 'id',
      configurationParameters: {},
    };
    pageletView = createContentPageletView(pagelet);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    component.pagelet = pageletView;
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
