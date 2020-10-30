import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { createContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ContentPageletComponent } from 'ish-shared/cms/components/content-pagelet/content-pagelet.component';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { ContentPageComponent } from './content-page.component';

describe('Content Page Component', () => {
  let fixture: ComponentFixture<ContentPageComponent>;
  let component: ContentPageComponent;
  let element: HTMLElement;
  let cmsFacade: CMSFacade;

  const contentPage = {
    resourceSetId: 'rid',
    domain: 'domain',
    definitionQualifiedName: 'test',
    id: 'id',
    displayName: 'test',
    pageletIDs: ['pid', 'cmp'],
  };

  beforeEach(async () => {
    cmsFacade = mock(cmsFacade);
    when(cmsFacade.contentPage$).thenReturn(EMPTY);
    when(cmsFacade.contentPageLoading$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [
        ContentPageComponent,
        MockComponent(BreadcrumbComponent),
        MockComponent(ContentPageletComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: CMSFacade, useFactory: () => instance(cmsFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading overlay when loading is true', () => {
    when(cmsFacade.contentPageLoading$).thenReturn(of(true));
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-loading",
      ]
    `);
  });

  it('should render first pagelet of content page when retrieved from facade', () => {
    when(cmsFacade.contentPage$).thenReturn(of(createContentPageletEntryPointView(contentPage)));
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-breadcrumb",
        "ish-content-pagelet",
      ]
    `);

    const child = fixture.debugElement.query(By.css('ish-content-pagelet'))
      .componentInstance as ContentPageletComponent;
    expect(child.pageletId).toMatchInlineSnapshot(`"pid"`);
  });
});
