import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageTreeElement } from 'ish-core/models/content-page-tree/content-page-tree.model';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';
import { ContentPageRoutePipe } from 'ish-core/routing/content-page/content-page-route.pipe';

import { ContentNavigationComponent } from './content-navigation.component';

describe('Content Navigation Component', () => {
  let component: ContentNavigationComponent;
  let fixture: ComponentFixture<ContentNavigationComponent>;
  let element: HTMLElement;
  let cmsFacade: CMSFacade;

  beforeEach(async () => {
    cmsFacade = mock(CMSFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ContentNavigationComponent, ContentPageRoutePipe],
      providers: [{ provide: CMSFacade, useFactory: () => instance(cmsFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('Page Tree Links', () => {
    beforeEach(() => {
      component.depth = 10;

      const pageTreeElement1: ContentPageTreeElement = {
        contentPageId: '1',
        name: 'Page 1',
        path: [],
      };

      const pageTreeElement1a: ContentPageTreeElement = {
        contentPageId: '1.A',
        name: 'Page 1.A',
        path: [],
      };

      const pageTreeElement1aa: ContentPageTreeElement = {
        contentPageId: '1.A.a',
        name: 'Page 1.A.a',
        path: [],
      };

      const pageTreeElement1ab: ContentPageTreeElement = {
        contentPageId: '1.A.b',
        name: 'Page 1.A.b',
        path: [],
      };

      const pageTreeElement1b: ContentPageTreeElement = {
        contentPageId: '1.B',
        name: 'Page 1.B',
        path: [],
      };

      component.contentPageTree = {
        ...pageTreeElement1,
        parent: undefined,
        children: [
          {
            ...pageTreeElement1a,
            parent: '1',
            children: [
              {
                ...pageTreeElement1aa,
                parent: '1.A',
                children: [],
                pathElements: [pageTreeElement1, pageTreeElement1a, pageTreeElement1aa],
              },
              {
                ...pageTreeElement1ab,
                parent: '1.A',
                children: [],
                pathElements: [pageTreeElement1, pageTreeElement1a, pageTreeElement1ab],
              },
            ],
            pathElements: [pageTreeElement1, pageTreeElement1a],
          },
          {
            ...pageTreeElement1b,
            parent: '1',
            children: [],
            pathElements: [pageTreeElement1, pageTreeElement1b],
          },
        ],
        pathElements: [pageTreeElement1],
      } as ContentPageTreeView;

      when(cmsFacade.contentPage$).thenReturn(of({ id: 'page-1' } as ContentPageletEntryPointView));
    });

    it('should get whole page tree, when maxDepth is greater than depth of actual page tree', () => {
      fixture.detectChanges();

      expect(element.querySelectorAll('a')).toMatchInlineSnapshot(`
        NodeList [
          <a
          class="link-decoration-hover"
          ng-reflect-router-link="/page-1-pg1"
          title="Page 1"
          href="/page-1-pg1"
          >Page 1</a
        >,
          <a
          class="link-decoration-hover"
          ng-reflect-router-link="/page-1/page-1.a-pg1.A"
          title="Page 1.A"
          href="/page-1/page-1.a-pg1.A"
          >Page 1.A</a
        >,
          <a
          class="link-decoration-hover"
          ng-reflect-router-link="/page-1/page-1.a/page-1.a.a-pg"
          title="Page 1.A.a"
          href="/page-1/page-1.a/page-1.a.a-pg1.A.a"
          >Page 1.A.a</a
        >,
          <a
          class="link-decoration-hover"
          ng-reflect-router-link="/page-1/page-1.a/page-1.a.b-pg"
          title="Page 1.A.b"
          href="/page-1/page-1.a/page-1.a.b-pg1.A.b"
          >Page 1.A.b</a
        >,
          <a
          class="link-decoration-hover"
          ng-reflect-router-link="/page-1/page-1.b-pg1.B"
          title="Page 1.B"
          href="/page-1/page-1.b-pg1.B"
          >Page 1.B</a
        >,
        ]
      `);
    });

    it('should split page tree, when given maxDepth is smaller than page tree depth', () => {
      component.depth = 2;
      fixture.detectChanges();

      expect(element.querySelectorAll('a')).toMatchInlineSnapshot(`
        NodeList [
          <a
          class="link-decoration-hover"
          ng-reflect-router-link="/page-1-pg1"
          title="Page 1"
          href="/page-1-pg1"
          >Page 1</a
        >,
          <a
          class="link-decoration-hover"
          ng-reflect-router-link="/page-1/page-1.a-pg1.A"
          title="Page 1.A"
          href="/page-1/page-1.a-pg1.A"
          >Page 1.A</a
        >,
          <a
          class="link-decoration-hover"
          ng-reflect-router-link="/page-1/page-1.b-pg1.B"
          title="Page 1.B"
          href="/page-1/page-1.b-pg1.B"
          >Page 1.B</a
        >,
        ]
      `);
    });

    describe('filter-selected', () => {
      it('should set no filter-selected class if no contentPageId equals the currentContentPageId', () => {
        when(cmsFacade.contentPage$).thenReturn(of({ id: 'xxx' } as ContentPageletEntryPointView));
        fixture.detectChanges();

        expect(element.querySelectorAll('.page-navigation-active')).toHaveLength(0);
      });

      it('should set filter-selected class just for root element', () => {
        when(cmsFacade.contentPage$).thenReturn(of({ id: '1.A' } as ContentPageletEntryPointView));
        fixture.detectChanges();

        expect(element.querySelectorAll('.page-navigation-active')).toMatchInlineSnapshot(`
          NodeList [
            <li class="page-navigation-active">
            <a
              class="link-decoration-hover"
              ng-reflect-router-link="/page-1/page-1.a-pg1.A"
              title="Page 1.A"
              href="/page-1/page-1.a-pg1.A"
              >Page 1.A</a
            >
            <ul ng-reflect-ng-class="page-navigation-2" class="page-navigation-2">
              <li>
                <a
                  class="link-decoration-hover"
                  ng-reflect-router-link="/page-1/page-1.a/page-1.a.a-pg"
                  title="Page 1.A.a"
                  href="/page-1/page-1.a/page-1.a.a-pg1.A.a"
                  >Page 1.A.a</a
                >
              </li>
              <li>
                <a
                  class="link-decoration-hover"
                  ng-reflect-router-link="/page-1/page-1.a/page-1.a.b-pg"
                  title="Page 1.A.b"
                  href="/page-1/page-1.a/page-1.a.b-pg1.A.b"
                  >Page 1.A.b</a
                >
              </li>
            </ul>
          </li>,
          ]
        `);
      });
    });

    describe('navigation-depth', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should set page-navigation-1 class to first layer', () => {
        expect(element.querySelectorAll('.page-navigation-1')).toMatchInlineSnapshot(`
          NodeList [
            <ul ng-reflect-ng-class="page-navigation-1" class="page-navigation-1">
            <li>
              <a
                class="link-decoration-hover"
                ng-reflect-router-link="/page-1/page-1.a-pg1.A"
                title="Page 1.A"
                href="/page-1/page-1.a-pg1.A"
                >Page 1.A</a
              >
              <ul ng-reflect-ng-class="page-navigation-2" class="page-navigation-2">
                <li>
                  <a
                    class="link-decoration-hover"
                    ng-reflect-router-link="/page-1/page-1.a/page-1.a.a-pg"
                    title="Page 1.A.a"
                    href="/page-1/page-1.a/page-1.a.a-pg1.A.a"
                    >Page 1.A.a</a
                  >
                </li>
                <li>
                  <a
                    class="link-decoration-hover"
                    ng-reflect-router-link="/page-1/page-1.a/page-1.a.b-pg"
                    title="Page 1.A.b"
                    href="/page-1/page-1.a/page-1.a.b-pg1.A.b"
                    >Page 1.A.b</a
                  >
                </li>
              </ul>
            </li>
            <li>
              <a
                class="link-decoration-hover"
                ng-reflect-router-link="/page-1/page-1.b-pg1.B"
                title="Page 1.B"
                href="/page-1/page-1.b-pg1.B"
                >Page 1.B</a
              >
            </li>
          </ul>,
          ]
        `);
      });

      it('should set page-navigation-2 class to second layer', () => {
        expect(element.querySelectorAll('.page-navigation-2')).toMatchInlineSnapshot(`
          NodeList [
            <ul ng-reflect-ng-class="page-navigation-2" class="page-navigation-2">
            <li>
              <a
                class="link-decoration-hover"
                ng-reflect-router-link="/page-1/page-1.a/page-1.a.a-pg"
                title="Page 1.A.a"
                href="/page-1/page-1.a/page-1.a.a-pg1.A.a"
                >Page 1.A.a</a
              >
            </li>
            <li>
              <a
                class="link-decoration-hover"
                ng-reflect-router-link="/page-1/page-1.a/page-1.a.b-pg"
                title="Page 1.A.b"
                href="/page-1/page-1.a/page-1.a.b-pg1.A.b"
                >Page 1.A.b</a
              >
            </li>
          </ul>,
          ]
        `);
      });
    });
  });
});
