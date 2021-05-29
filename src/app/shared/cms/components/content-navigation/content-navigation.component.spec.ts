import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { anyNumber, instance, mock, when } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageTreeView } from 'ish-core/models/content-page-tree-view/content-page-tree-view.model';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';

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
      declarations: [ContentNavigationComponent],
      providers: [{ provide: CMSFacade, useFactory: () => instance(cmsFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    when(cmsFacade.contentPage$).thenReturn(of({ id: 'page-1' } as ContentPageletEntryPointView));
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
      component.root = '1';
      component.depth = 10;

      when(cmsFacade.contentPageTree$('1', anyNumber())).thenReturn(
        of({
          contentPageId: '1',
          name: 'Page 1',
          parent: undefined,
          children: [
            {
              contentPageId: '1.A',
              name: 'Page 1.A',
              parent: '1',
              children: [
                {
                  contentPageId: '1.A.a',
                  name: 'Page 1.A.a',
                  parent: '1.A',
                  children: [],
                },
                {
                  contentPageId: '1.A.b',
                  name: 'Page 1.A.b',
                  parent: '1.A',
                  children: [],
                },
              ],
            },
            {
              contentPageId: '1.B',
              name: 'Page 1.B',
              parent: '1',
              children: [],
            },
          ],
        } as ContentPageTreeView)
      );
    });

    it('should get whole page tree, when maxDepth is greater than depth of actual page tree', () => {
      component.ngOnChanges();
      fixture.detectChanges();

      expect(element.querySelectorAll('a')).toMatchInlineSnapshot(`
        NodeList [
          <a ng-reflect-router-link="/page,1" title="Page 1" href="/page/1">Page 1</a>,
          <a ng-reflect-router-link="/page,1.A" title="Page 1.A" href="/page/1.A">Page 1.A</a>,
          <a ng-reflect-router-link="/page,1.A.a" title="Page 1.A.a" href="/page/1.A.a">Page 1.A.a</a>,
          <a ng-reflect-router-link="/page,1.A.b" title="Page 1.A.b" href="/page/1.A.b">Page 1.A.b</a>,
          <a ng-reflect-router-link="/page,1.B" title="Page 1.B" href="/page/1.B">Page 1.B</a>,
        ]
      `);
    });

    it('should split page tree, when given maxDepth is smaller than page tree depth', () => {
      component.depth = 0;

      component.ngOnChanges();
      fixture.detectChanges();

      expect(element.querySelectorAll('a')).toMatchInlineSnapshot(`
        NodeList [
          <a ng-reflect-router-link="/page,1" title="Page 1" href="/page/1">Page 1</a>,
          <a ng-reflect-router-link="/page,1.A" title="Page 1.A" href="/page/1.A">Page 1.A</a>,
          <a ng-reflect-router-link="/page,1.B" title="Page 1.B" href="/page/1.B">Page 1.B</a>,
        ]
      `);
    });

    describe('filter-selected', () => {
      it('should set no filter-selected class if no contentPageId equals the currentContentPageId', () => {
        when(cmsFacade.contentPage$).thenReturn(of({ id: 'xxx' } as ContentPageletEntryPointView));

        component.ngOnChanges();
        fixture.detectChanges();

        expect(element.querySelectorAll('.page-navigation-active')).toHaveLength(0);
      });

      it('should set filter-selected class just for root element', () => {
        when(cmsFacade.contentPage$).thenReturn(of({ id: '1.A' } as ContentPageletEntryPointView));

        component.ngOnChanges();
        fixture.detectChanges();

        expect(element.querySelectorAll('.page-navigation-active')).toMatchInlineSnapshot(`
          NodeList [
            <li class="page-navigation-active">
            <a ng-reflect-router-link="/page,1.A" title="Page 1.A" href="/page/1.A">Page 1.A</a>
            <ul class="page-navigation-1" ng-reflect-ng-class="page-navigation-1">
              <li>
                <a ng-reflect-router-link="/page,1.A.a" title="Page 1.A.a" href="/page/1.A.a">Page 1.A.a</a>
              </li>
              <li>
                <a ng-reflect-router-link="/page,1.A.b" title="Page 1.A.b" href="/page/1.A.b">Page 1.A.b</a>
              </li>
            </ul>
          </li>,
          ]
        `);
      });
    });

    describe('navigation-depth', () => {
      beforeEach(() => {
        component.ngOnChanges();
        fixture.detectChanges();
      });

      it('should set page-navigation-0 class to first layer', () => {
        expect(element.querySelectorAll('.page-navigation-0')).toMatchInlineSnapshot(`
          NodeList [
            <ul class="page-navigation-0" ng-reflect-ng-class="page-navigation-0">
            <li>
              <a ng-reflect-router-link="/page,1.A" title="Page 1.A" href="/page/1.A">Page 1.A</a>
              <ul class="page-navigation-1" ng-reflect-ng-class="page-navigation-1">
                <li>
                  <a ng-reflect-router-link="/page,1.A.a" title="Page 1.A.a" href="/page/1.A.a">Page 1.A.a</a>
                </li>
                <li>
                  <a ng-reflect-router-link="/page,1.A.b" title="Page 1.A.b" href="/page/1.A.b">Page 1.A.b</a>
                </li>
              </ul>
            </li>
            <li><a ng-reflect-router-link="/page,1.B" title="Page 1.B" href="/page/1.B">Page 1.B</a></li>
          </ul>,
          ]
        `);
      });

      it('should set page-navigation-1 class to second layer', () => {
        expect(element.querySelectorAll('.page-navigation-1')).toMatchInlineSnapshot(`
          NodeList [
            <ul class="page-navigation-1" ng-reflect-ng-class="page-navigation-1">
            <li>
              <a ng-reflect-router-link="/page,1.A.a" title="Page 1.A.a" href="/page/1.A.a">Page 1.A.a</a>
            </li>
            <li>
              <a ng-reflect-router-link="/page,1.A.b" title="Page 1.A.b" href="/page/1.A.b">Page 1.A.b</a>
            </li>
          </ul>,
          ]
        `);
      });
    });
  });
});
