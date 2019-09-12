import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Dictionary } from '@ngrx/entity';
import { MockComponent } from 'ng-mocks';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentSlot } from 'ish-core/models/content-slot/content-slot.model';
import { createContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { ContentPageletContainerComponent } from 'ish-shared/cms/containers/content-pagelet/content-pagelet.container';

import { ContentPageComponent } from './content-page.component';

describe('Content Page Component', () => {
  let component: ContentPageComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<ContentPageComponent>;
  let contentPage: ContentPageletEntryPoint;
  let pagelets: Dictionary<ContentPagelet>;
  let slot: ContentSlot;

  beforeEach(async(() => {
    slot = {
      displayName: 'slot1',
      configurationParameters: {},
      definitionQualifiedName: 'app_sf_responsive_cm:slot.pagevariant.content.pagelet2-Slot',
      pageletIDs: ['cmp'],
    };

    pagelets = {
      pid: {
        displayName: 'pid',
        domain: 'domain',
        definitionQualifiedName: 'fq',
        id: 'pid',
        configurationParameters: {
          HTML: 'foo',
        },
        slots: [slot],
      },
      cmp: {
        displayName: 'cmp',
        domain: 'domain',
        definitionQualifiedName: 'component',
        id: 'cmp',
        configurationParameters: {
          HTML: '<div>test</div>',
        },
      },
    };

    contentPage = {
      resourceSetId: 'rid',
      domain: 'domain',
      definitionQualifiedName: 'test',
      id: 'id',
      displayName: 'test',
      pageletIDs: [pagelets.pid.id, pagelets.cmp.id],
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ContentPageComponent, MockComponent(ContentPageletContainerComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.contentPage = createContentPageletEntryPointView(contentPage, pagelets);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
