import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import {
  ContentPageletEntryPointView,
  ContentPageletView,
  createContentPageletView,
} from 'ish-core/models/content-view/content-view.model';
import { PreviewService } from 'ish-core/utils/preview/preview.service';

import { ContentDesignViewWrapperComponent } from './content-design-view-wrapper.component';

describe('Content Design View Wrapper Component', () => {
  let component: ContentDesignViewWrapperComponent;
  let fixture: ComponentFixture<ContentDesignViewWrapperComponent>;
  let element: HTMLElement;
  let cmsFacade: CMSFacade;
  let previewService: PreviewService;

  beforeEach(async () => {
    cmsFacade = mock(CMSFacade);
    previewService = mock(PreviewService);
    when(cmsFacade.pagelet$(anything())).thenReturn(
      of({ id: 'xyz', displayName: 'Pagelet Name xyz' } as ContentPageletView)
    );
    when(previewService.previewContextId).thenReturn('DESIGNVIEW');

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ContentDesignViewWrapperComponent, MockComponent(FaIconComponent)],
      providers: [
        { provide: CMSFacade, useFactory: () => instance(cmsFacade) },
        { provide: PreviewService, useFactory: () => instance(previewService) },
      ],
    }).compileComponents();
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
    fixture.detectChanges();

    expect(component.type).toEqual('pagelet');
    expect(element).toMatchInlineSnapshot(`
      <div class="designview-wrapper pagelet" ng-reflect-ng-class="pagelet">
        <div class="designview-wrapper-actions">
          <div class="name">Pagelet Name xyz</div>
          <button class="btn" title="designview.edit.link.title">
            <fa-icon ng-reflect-icon="fas,pencil-alt"></fa-icon>
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
    fixture.detectChanges();

    expect(component.type).toEqual('slot');
    expect(element).toMatchInlineSnapshot(`
      <div class="designview-wrapper slot" ng-reflect-ng-class="slot">
        <div class="designview-wrapper-actions">
          <div class="name">Slot Name xyz</div>
          <button class="btn" title="designview.add.link.title">
            <fa-icon ng-reflect-icon="fas,plus"></fa-icon>
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
    fixture.detectChanges();

    expect(component.type).toEqual('include');
    expect(element).toMatchInlineSnapshot(`
      <div class="designview-wrapper include" ng-reflect-ng-class="include">
        <div class="designview-wrapper-actions">
          <div class="name">Include Name xyz</div>
          <button class="btn" title="designview.add.link.title">
            <fa-icon ng-reflect-icon="fas,plus"></fa-icon>
          </button>
        </div>
      </div>
    `);
  });
});
