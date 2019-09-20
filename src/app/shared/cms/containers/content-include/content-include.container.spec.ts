import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import {
  ContentPageletEntryPointView,
  createContentPageletEntryPointView,
} from 'ish-core/models/content-view/content-view.model';
import { ContentPageletContainerComponent } from 'ish-shared/cms/containers/content-pagelet/content-pagelet.container';

import { ContentIncludeContainerComponent } from './content-include.container';

describe('Content Include Container', () => {
  let component: ContentIncludeContainerComponent;
  let fixture: ComponentFixture<ContentIncludeContainerComponent>;
  let element: HTMLElement;
  let include: ContentPageletEntryPointView;
  let cmsFacade: CMSFacade;

  beforeEach(async(() => {
    include = createContentPageletEntryPointView(
      {
        id: 'test.include',
        definitionQualifiedName: 'test.include-Include',
        domain: 'domain',
        displayName: 'displayName',
        resourceSetId: 'resId',
        configurationParameters: {
          key: '1',
        },
      },
      undefined
    );

    cmsFacade = mock(CMSFacade);
    when(cmsFacade.contentInclude$(anything())).thenReturn(of(include));
    when(cmsFacade.contentIncludeSfeMetadata$(anything())).thenReturn(EMPTY);

    TestBed.configureTestingModule({
      declarations: [ContentIncludeContainerComponent, MockComponent(ContentPageletContainerComponent)],
      providers: [{ provide: CMSFacade, useValue: instance(cmsFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentIncludeContainerComponent);
    component = fixture.componentInstance;
    component.includeId = include.id;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('with content', () => {
    it('should have the matching include available for rendering', done => {
      component.ngOnChanges();
      fixture.detectChanges();
      component.contentInclude$.subscribe(inc => {
        expect(inc.id).toEqual('test.include');
        expect(inc.numberParam('key')).toBe(1);
        done();
      });
    });
  });
});
