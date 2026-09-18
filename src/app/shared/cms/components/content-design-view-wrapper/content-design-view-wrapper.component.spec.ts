/* eslint-disable @typescript-eslint/dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
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
      imports: [TranslatePipe],
      declarations: [ContentDesignViewWrapperComponent, MockDirective(ScrollDirective)],
      providers: [
        { provide: CMSFacade, useFactory: () => instance(cmsFacade) },
        { provide: DesignViewService, useFactory: () => instance(designViewService) },
        provideTranslateService(),
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

  it('should not render the design view wrapper if no input parameter is given', () => {
    fixture.detectChanges();

    expect(element.querySelector('.design-view-wrapper')).toBeNull();
  });

  it('should render a pagelet edit action if a pageletId is given', () => {
    component.pageletId = 'xyz';
    // afterNextRender doesn't fire in Jest - manually trigger initialization
    component.isDesignViewMode = true;
    component['initializeComponent']();
    fixture.detectChanges();

    expect(component.type).toEqual('pagelet');
    expect(element.querySelector('.design-view-wrapper')?.classList).toContain('pagelet');

    const button = element.querySelector<HTMLButtonElement>('.design-view-wrapper-actions button');
    expect(button?.title).toEqual('designview.edit.link.title Pagelet Name xyz');
    expect(button?.getAttribute('aria-label')).toEqual('designview.edit.link.title Pagelet Name xyz');
    expect(button?.querySelector('i')?.classList).toContain('bi-pencil-fill');
  });

  it('should render a slot add action if a slotId is given', () => {
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
    expect(element.querySelector('.design-view-wrapper')?.classList).toContain('slot');
    expect(element.querySelector('.name')?.textContent).toContain('Slot Name xyz');

    const button = element.querySelector<HTMLButtonElement>('.design-view-wrapper-actions button');
    expect(button?.title).toEqual('designview.add.link.title');
    expect(button?.querySelector('i')?.classList).toContain('bi-plus');
  });

  it('should render an include add action if an include is given', () => {
    component.include = {
      id: 'xyz_include_id',
      displayName: 'Include Name xyz',
    } as ContentPageletEntryPointView;
    // afterNextRender doesn't fire in Jest - manually trigger initialization
    component.isDesignViewMode = true;
    component['initializeComponent']();
    fixture.detectChanges();

    expect(component.type).toEqual('include');
    expect(element.querySelector('.design-view-wrapper')?.classList).toContain('include');
    expect(element.querySelector('.name')?.textContent).toContain('Include Name xyz');

    const button = element.querySelector<HTMLButtonElement>('.design-view-wrapper-actions button');
    expect(button?.title).toEqual('designview.add.link.title');
    expect(button?.querySelector('i')?.classList).toContain('bi-plus');
  });
});
