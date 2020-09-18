import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentPageletView, createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ContentSlotComponent } from 'ish-shared/cms/components/content-slot/content-slot.component';

import { CMSStandardPageComponent } from './cms-standard-page.component';

describe('Cms Standard Page Component', () => {
  let component: CMSStandardPageComponent;
  let fixture: ComponentFixture<CMSStandardPageComponent>;
  let element: HTMLElement;
  let pageletView: ContentPageletView;
  let pagelet: ContentPagelet;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CMSStandardPageComponent, MockComponent(ContentSlotComponent)],
    }).compileComponents();
  });

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
    pageletView = createContentPageletView(pagelet);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    component.pagelet = pageletView;
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
