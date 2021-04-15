import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { pageTreeView } from 'ish-core/utils/dev/test-data-utils';

import { CMSNavigationComponent } from './cms-navigation.component';

describe('Cms Navigation Component', () => {
  let component: CMSNavigationComponent;
  let fixture: ComponentFixture<CMSNavigationComponent>;
  let element: HTMLElement;
  let cmsFacade: CMSFacade;

  beforeEach(async () => {
    cmsFacade = mock(CMSFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CMSNavigationComponent],
      providers: [{ provide: CMSFacade, useFactory: () => instance(cmsFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    when(cmsFacade.selectedContentPageId$).thenReturn(of('page-1'));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  describe('Page Tree Links', () => {
    beforeEach(() => {
      // Depth of tree is 1 (0 is included)
      when(cmsFacade.getContentPageTreeView$('1')).thenReturn(of(pageTreeView('1', ['1.A', '1.B'])));
      when(cmsFacade.getContentPageTreeView$('1.A')).thenReturn(of(pageTreeView('1.A', ['1.A.a', '1.A.b'])));
      when(cmsFacade.getContentPageTreeView$('1.A.a')).thenReturn(of(pageTreeView('1.A.a')));
      when(cmsFacade.getContentPageTreeView$('1.A.b')).thenReturn(of(pageTreeView('1.A.b')));
      when(cmsFacade.getContentPageTreeView$('1.B')).thenReturn(of(pageTreeView('1.B')));
    });

    it('should get whole page tree, when maxDepth is greater than depth of actual page tree', () => {
      component.contentPageId = '1';
      component.actualDepth = 0;
      component.maxDepth = 5;
      component.root = '1';

      component.ngOnChanges();
      fixture.detectChanges();

      expect(element.querySelectorAll('a')).toMatchInlineSnapshot(`
        NodeList [
          <a class="filter-item-name" ng-reflect-router-link="/page/1" href="/page/1"> Page 1 </a>,
          <a class="filter-item-name" ng-reflect-router-link="/page/1.A" href="/page/1.A"> Page 1.A </a>,
          <a class="filter-item-name" ng-reflect-router-link="/page/1.A.a" href="/page/1.A.a"> Page 1.A.a </a>,
          <a class="filter-item-name" ng-reflect-router-link="/page/1.A.b" href="/page/1.A.b"> Page 1.A.b </a>,
          <a class="filter-item-name" ng-reflect-router-link="/page/1.B" href="/page/1.B"> Page 1.B </a>,
        ]
      `);
    });

    it('should split page tree, when given maxDepth is smaller than page tree depth', () => {
      component.contentPageId = '1';
      component.actualDepth = 0;
      component.maxDepth = 0;
      component.root = '1';

      component.ngOnChanges();
      fixture.detectChanges();

      expect(element.querySelectorAll('a')).toMatchInlineSnapshot(`
        NodeList [
          <a class="filter-item-name" ng-reflect-router-link="/page/1" href="/page/1"> Page 1 </a>,
          <a class="filter-item-name" ng-reflect-router-link="/page/1.A" href="/page/1.A"> Page 1.A </a>,
          <a class="filter-item-name" ng-reflect-router-link="/page/1.B" href="/page/1.B"> Page 1.B </a>,
        ]
      `);
    });

    it('should get sub page tree, when given root is sub element of page tree', () => {
      component.contentPageId = '1.A';
      component.actualDepth = 0;
      component.maxDepth = 5;
      component.root = '1.A';

      component.ngOnChanges();
      fixture.detectChanges();

      expect(element.querySelectorAll('a')).toMatchInlineSnapshot(`
        NodeList [
          <a class="filter-item-name" ng-reflect-router-link="/page/1.A" href="/page/1.A"> Page 1.A </a>,
          <a class="filter-item-name" ng-reflect-router-link="/page/1.A.a" href="/page/1.A.a"> Page 1.A.a </a>,
          <a class="filter-item-name" ng-reflect-router-link="/page/1.A.b" href="/page/1.A.b"> Page 1.A.b </a>,
        ]
      `);
    });

    describe('filter-selected', () => {
      beforeEach(() => when(cmsFacade.selectedContentPageId$).thenReturn(of('1')));

      it('should set no filter-selected class if no contentPageId equals the currentContentPageId', () => {
        component.contentPageId = '1.A';
        component.actualDepth = 0;
        component.maxDepth = 5;
        component.root = '1.A';

        component.ngOnChanges();
        fixture.detectChanges();

        expect(element.querySelectorAll('.filter-selected')).toHaveLength(0);
      });

      it('should set filter-selected class just for root element', () => {
        component.contentPageId = '1';
        component.actualDepth = 0;
        component.maxDepth = 5;
        component.root = '1';

        component.ngOnChanges();
        fixture.detectChanges();

        expect(element.querySelectorAll('.filter-selected')).toMatchInlineSnapshot(`
          NodeList [
            <a class="filter-item-name filter-selected" ng-reflect-router-link="/page/1" href="/page/1">
            Page 1
          </a>,
          ]
        `);
      });
    });
  });
});
