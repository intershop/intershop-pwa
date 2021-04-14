import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletTreeView } from 'ish-core/models/content-pagelet-tree-view/content-pagelet-tree-view.model';

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

  it('should create all links for tree', () => {
    when(cmsFacade.getContentPageTreeView$('page-1')).thenReturn(
      of({
        uniqueId: 'page-1',
        contentPageId: 'page-1',
        name: 'Page 1',
        children: ['page-1.page-1.1', 'page-1.page-1.2'],
      } as ContentPageletTreeView)
    );

    when(cmsFacade.getContentPageTreeView$('page-1.page-1.1')).thenReturn(
      of({
        uniqueId: 'page-1.page-1.1',
        contentPageId: 'page-1.page-1.1',
        name: 'Page 1.1',
      } as ContentPageletTreeView)
    );

    when(cmsFacade.getContentPageTreeView$('page-1.page-1.2')).thenReturn(
      of({
        uniqueId: 'page-1.page-1.2',
        contentPageId: 'page-1.page-1.2',
        name: 'Page 1.2',
      } as ContentPageletTreeView)
    );

    component.uniqueId = 'page-1';
    component.actualDepth = 0;
    component.maxDepth = 5;
    component.root = 'page-1';

    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelectorAll('a')).toMatchInlineSnapshot(`
      NodeList [
        <a
        class="filter-item-name filter-selected"
        ng-reflect-router-link="/page/page-1"
        href="/page/page-1"
      >
        Page 1
      </a>,
        <a
        class="filter-item-name"
        ng-reflect-router-link="/page/page-1.page-1.1"
        href="/page/page-1.page-1.1"
      >
        Page 1.1
      </a>,
        <a
        class="filter-item-name"
        ng-reflect-router-link="/page/page-1.page-1.2"
        href="/page/page-1.page-1.2"
      >
        Page 1.2
      </a>,
      ]
    `);
  });
});
