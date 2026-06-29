/* eslint-disable @typescript-eslint/dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ScrollDirective } from 'ish-core/directives/scroll.directive';
import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import {
  ContentPageletEntryPointView,
  ContentPageletView,
  createContentPageletView,
} from 'ish-core/models/content-view/content-view.model';
import { DesignViewService } from 'ish-core/utils/design-view/design-view.service';

import { ContentDesignViewWrapperComponent } from './content-design-view-wrapper.component';

describe('Content Design View Wrapper Component', () => {
  let component: ContentDesignViewWrapperComponent;
  let fixture: ComponentFixture<ContentDesignViewWrapperComponent>;
  let element: HTMLElement;
  let cmsFacade: CMSFacade;
  let designViewService: DesignViewService;

  beforeEach(async () => {
    cmsFacade = mock(CMSFacade);
    designViewService = mock(DesignViewService);

    when(cmsFacade.pagelet$(anything())).thenReturn(
      of({ id: 'xyz', displayName: 'Pagelet Name xyz' } as ContentPageletView)
    );
    when(cmsFacade.designViewSelectedPageletId$).thenReturn(of('xyz'));
    when(cmsFacade.designViewPreviewedPageletId$).thenReturn(of(undefined));
    when(cmsFacade.designViewScrollToPageletId$).thenReturn(of('xyz'));
    when(designViewService.isDesignViewMode()).thenReturn(true);

    await TestBed.configureTestingModule({
      imports: [ContentDesignViewWrapperComponent],
      providers: [
        { provide: CMSFacade, useFactory: () => instance(cmsFacade) },
        { provide: DesignViewService, useFactory: () => instance(designViewService) },
        provideTranslateService(),
      ],
    })
      .overrideComponent(ContentDesignViewWrapperComponent, {
        remove: { imports: [ScrollDirective] },
        add: { imports: [MockDirective(ScrollDirective)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentDesignViewWrapperComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not be rendered if no input parameter is given', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should be rendered if a pageletId is given', () => {
    component.pageletId = 'xyz';
    // afterNextRender doesn't fire in Jest - manually trigger initialization
    component.isDesignViewMode = true;
    component['initializeComponent']();
    fixture.detectChanges();

    expect(component.type).toEqual('pagelet');
    expect(element).toMatchInlineSnapshot(`
      <div
        scrollcontainer="root"
        class="design-view-wrapper pagelet pagelet-selected"
        ng-reflect-scroll-container="root"
        ng-reflect-ish-scroll="true"
        ng-reflect-ng-class="pagelet,pagelet-selected,"
        ng-reflect-scroll-duration="500"
        ng-reflect-scroll-spacing="50"
      >
        <div class="design-view-wrapper-actions">
          <button type="button" class="btn" title="designview.edit.link.title Pagelet Name xyz">
            <i class="bi bi-pencil-fill"></i>
          </button>
        </div>
      </div>
    `);
  });

  it('should be rendered if a slotId is given', () => {
    component.slotId = 'xyz_slot_id';
    component.pagelet = createContentPageletView({
      id: 'xyz_pagelet_id',
      displayName: 'Pagelet Name xyz_slot',
      slots: [
        {
          definitionQualifiedName: component.slotId,
          displayName: 'Slot Name xyz',
        },
      ],
    } as ContentPagelet);
    // afterNextRender doesn't fire in Jest - manually trigger initialization
    component.isDesignViewMode = true;
    component['initializeComponent']();
    fixture.detectChanges();

    expect(component.type).toEqual('slot');
    expect(element).toMatchInlineSnapshot(`
      <div
        scrollcontainer="root"
        class="design-view-wrapper slot"
        ng-reflect-scroll-container="root"
        ng-reflect-ng-class="slot,,"
        ng-reflect-scroll-duration="500"
        ng-reflect-scroll-spacing="50"
      >
        <div class="design-view-wrapper-actions">
          <div class="name">Slot Name xyz</div>
          <button type="button" class="btn" title="designview.add.link.title">
            <i class="bi bi-plus"></i>
          </button>
        </div>
      </div>
    `);
  });

  it('should be rendered if an include is given', () => {
    component.include = {
      id: 'xyz_include_id',
      displayName: 'Include Name xyz',
    } as ContentPageletEntryPointView;
    // afterNextRender doesn't fire in Jest - manually trigger initialization
    component.isDesignViewMode = true;
    component['initializeComponent']();
    fixture.detectChanges();

    expect(component.type).toEqual('include');
    expect(element).toMatchInlineSnapshot(`
      <div
        scrollcontainer="root"
        class="design-view-wrapper include"
        ng-reflect-scroll-container="root"
        ng-reflect-ng-class="include,,"
        ng-reflect-scroll-duration="500"
        ng-reflect-scroll-spacing="50"
      >
        <div class="design-view-wrapper-actions">
          <div class="name">Include Name xyz</div>
          <button type="button" class="btn" title="designview.add.link.title">
            <i class="bi bi-plus"></i>
          </button>
        </div>
      </div>
    `);
  });
});
