import { APP_BASE_HREF } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { noop, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSTextComponent } from 'ish-shared/cms/components/cms-text/cms-text.component';
import { CMS_COMPONENT } from 'ish-shared/cms/configurations/injection-keys';

import { ContentPageletComponent } from './content-pagelet.component';

describe('Content Pagelet Component', () => {
  let component: ContentPageletComponent;
  let fixture: ComponentFixture<ContentPageletComponent>;
  let element: HTMLElement;
  let pagelet: ContentPagelet;
  let cmsFacade: CMSFacade;

  beforeEach(async () => {
    cmsFacade = mock(CMSFacade);

    const appFacade = mock(AppFacade);
    when(appFacade.icmBaseUrl).thenReturn('http://example.org');

    await TestBed.configureTestingModule({
      declarations: [CMSTextComponent, ServerHtmlDirective],
      providers: [
        {
          provide: CMS_COMPONENT,
          useValue: { definitionQualifiedName: 'fq-defined', class: CMSTextComponent },
          multi: true,
        },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CMSFacade, useFactory: () => instance(cmsFacade) },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ContentPageletComponent, { set: { entryComponents: [CMSTextComponent] } })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageletComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    pagelet = {
      definitionQualifiedName: 'fq',
      id: 'id',
      displayName: 'pagelet',
      domain: 'domain',
      configurationParameters: {
        HTMLText: 'foo',
      },
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    when(cmsFacade.pagelet$(anything())).thenReturn(of(createContentPageletView(pagelet)));
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementationOnce(noop);

    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();

    expect(element).toMatchInlineSnapshot(`N/A`);
    expect(consoleSpy).toHaveBeenCalledWith('did not find mapping for id (fq)');
  });

  it('should render assigned template if name matches', () => {
    pagelet.definitionQualifiedName = 'fq-defined';
    when(cmsFacade.pagelet$(anything())).thenReturn(of(createContentPageletView(pagelet)));

    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();

    expect(element).toMatchInlineSnapshot(`<ish-cms-text><span>foo</span></ish-cms-text>`);
  });
});
