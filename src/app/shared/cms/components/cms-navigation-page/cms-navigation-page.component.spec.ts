import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { CMSFacade } from 'ish-core/facades/cms.facade';
import { createCompleteContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageTree } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { ContentPageRoutePipe } from 'ish-core/routing/content-page/content-page-route.pipe';

import { CMSNavigationPageComponent } from './cms-navigation-page.component';

describe('Cms Navigation Page Component', () => {
  let component: CMSNavigationPageComponent;
  let fixture: ComponentFixture<CMSNavigationPageComponent>;
  let element: HTMLElement;
  let cmsFacade: CMSFacade;

  const pagelet = {
    definitionQualifiedName: 'dqn',
    id: 'id',
    displayName: 'name',
    domain: 'domain',
    configurationParameters: {
      Page: 'ebene_1',
      SubNavigationDepth: 0,
    },
  };

  const pageTree: ContentPageTree = {
    rootIds: ['ebene_1'],
    edges: {
      ebene_1: ['ebene_2'],
      ebene_2: ['ebene_3', 'ebene_3a', 'ebene_3b'],
      ebene_3: ['ebene_4'],
    },
    nodes: {
      ebene_1: {
        name: 'Ebene 1',
        path: ['ebene_1'],
        contentPageId: 'ebene_1',
      },
      ebene_2: {
        name: 'Ebene 2',
        path: ['ebene_1', 'ebene_2'],
        contentPageId: 'ebene_2',
      },
      ebene_3: {
        name: 'Ebene 3',
        path: ['ebene_1', 'ebene_2', 'ebene_3'],
        contentPageId: 'ebene_3',
      },
      ebene_3a: {
        name: 'Ebene 3a',
        path: ['ebene_1', 'ebene_2', 'ebene_3a'],
        contentPageId: 'ebene_3a',
      },
      ebene_3b: {
        name: 'Ebene 3b',
        path: ['ebene_1', 'ebene_2', 'ebene_3b'],
        contentPageId: 'ebene_3b',
      },
      ebene_4: {
        name: 'Ebene 4',
        path: ['ebene_1', 'ebene_2', 'ebene_3', 'ebene_4'],
        contentPageId: 'ebene_4',
      },
    },
  };

  beforeEach(async () => {
    cmsFacade = mock(CMSFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        CMSNavigationPageComponent,
        MockComponent(FaIconComponent),
        MockDirective(ServerHtmlDirective),
        MockPipe(ContentPageRoutePipe),
      ],
      providers: [{ provide: CMSFacade, useFactory: () => instance(cmsFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSNavigationPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(cmsFacade.completeContentPageTree$(anything(), 0)).thenReturn(
      of(createCompleteContentPageTreeView(pageTree, 'ebene_1', 0))
    );
    when(cmsFacade.completeContentPageTree$(anything(), 1)).thenReturn(
      of(createCompleteContentPageTreeView(pageTree, 'ebene_1', 1))
    );
    when(cmsFacade.completeContentPageTree$(anything(), 3)).thenReturn(
      of(createCompleteContentPageTreeView(pageTree, 'ebene_1', 3))
    );
    when(cmsFacade.completeContentPageTree$(anything(), 2)).thenReturn(
      of(createCompleteContentPageTreeView(pageTree, 'ebene_4', 2))
    );
  });

  it('should be created', () => {
    component.pagelet = createContentPageletView(pagelet);
    component.ngOnChanges();
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`<li class="dropdown"><a style="width: 100%"> Ebene 1 </a></li>`);
  });

  it('should render an Alternative Display Name and a CSS Class if set', () => {
    component.pagelet = createContentPageletView({
      ...pagelet,
      configurationParameters: {
        ...pagelet.configurationParameters,
        DisplayName: 'Navigation Page',
        CSSClass: 'nav-page',
      },
    });
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(
      `<li class="dropdown nav-page"><a style="width: 100%"> Navigation Page </a></li>`
    );
  });

  it('should render Subnavigation HTML if set', () => {
    component.pagelet = createContentPageletView({
      ...pagelet,
      configurationParameters: { ...pagelet.configurationParameters, SubNavigationHTML: '<span>Hello Page</span>' },
    });
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <li class="dropdown">
        <a> Ebene 1 </a><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a>
        <ul class="category-level1 dropdown-menu">
          <li class="sub-navigation-content">
            <div ng-reflect-ish-server-html="<span>Hello Page</span>"></div>
          </li>
        </ul>
      </li>
    `);
  });

  it('should render page tree and Subnavigation HTML if both are set', () => {
    component.pagelet = createContentPageletView({
      ...pagelet,
      configurationParameters: {
        ...pagelet.configurationParameters,
        SubNavigationDepth: 1,
        SubNavigationHTML: '<span>Hello Page</span>',
      },
    });
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <li class="dropdown">
        <a> Ebene 1 </a><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a>
        <ul class="category-level1 dropdown-menu">
          <li class="main-navigation-level1-item"><a style="width: 100%"> Ebene 2 </a></li>
          <li class="sub-navigation-content">
            <div ng-reflect-ish-server-html="<span>Hello Page</span>"></div>
          </li>
        </ul>
      </li>
    `);
  });

  it('should render a page tree with Subnavigation Depth of 3 if set', () => {
    component.pagelet = createContentPageletView({
      ...pagelet,
      configurationParameters: {
        ...pagelet.configurationParameters,
        SubNavigationDepth: 3,
      },
    });
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <li class="dropdown">
        <a> Ebene 1 </a><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a>
        <ul class="category-level1 dropdown-menu">
          <li class="main-navigation-level1-item">
            <a> Ebene 2 </a><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a>
            <ul class="category-level2">
              <li class="main-navigation-level2-item">
                <a> Ebene 3 </a
                ><a class="dropdown-toggle"><fa-icon ng-reflect-icon="fas,plus"></fa-icon></a>
                <ul class="category-level3">
                  <li class="main-navigation-level3-item"><a style="width: 100%"> Ebene 4 </a></li>
                </ul>
              </li>
              <li class="main-navigation-level2-item"><a style="width: 100%"> Ebene 3a </a></li>
              <li class="main-navigation-level2-item"><a style="width: 100%"> Ebene 3b </a></li>
            </ul>
          </li>
        </ul>
      </li>
    `);
  });

  it('should not render a sub naviagtion if page has no children even if Subnavigation Depth is set', () => {
    component.pagelet = createContentPageletView({
      ...pagelet,
      configurationParameters: {
        ...pagelet.configurationParameters,
        SubNavigationDepth: 2,
      },
    });
    component.ngOnChanges();
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`<li class="dropdown"><a style="width: 100%"> Ebene 4 </a></li>`);
  });
});
