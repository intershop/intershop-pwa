import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { createSimplePageletView } from 'ish-core/utils/dev/test-data-utils';
import { CMSTextComponent } from 'ish-shared/cms/components/cms-text/cms-text.component';
import { CMS_COMPONENT } from 'ish-shared/cms/configurations/injection-keys';
import { SfeAdapterService } from 'ish-shared/cms/sfe-adapter/sfe-adapter.service';

import { ContentPageletContainerComponent } from './content-pagelet.container';

function createContentPageletMock(id: string, definitionQualifiedName: string) {
  return {
    definitionQualifiedName,
    id,
    displayName: 'pagelet',
    domain: 'domain',
    configurationParameters: {
      HTMLText: 'foo',
    },
  };
}

describe('Content Pagelet Container', () => {
  let component: ContentPageletContainerComponent;
  let fixture: ComponentFixture<ContentPageletContainerComponent>;
  let element: HTMLElement;
  let sfeAdapterMock: SfeAdapterService;
  let cmsFacade: CMSFacade;

  beforeEach(async(() => {
    sfeAdapterMock = mock(SfeAdapterService);
    when(sfeAdapterMock.isInitialized()).thenReturn(true);

    cmsFacade = mock(CMSFacade);
    when(cmsFacade.pagelet$('cmsText')).thenReturn(
      of(createSimplePageletView(createContentPageletMock('cmsText', 'fq-defined')))
    );
    when(cmsFacade.pagelet$('id')).thenReturn(of(createSimplePageletView(createContentPageletMock('id', 'fq'))));

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ngrxTesting()],
      declarations: [CMSTextComponent, ContentPageletContainerComponent, ServerHtmlDirective],
      providers: [
        {
          provide: CMS_COMPONENT,
          useValue: { definitionQualifiedName: 'fq-defined', class: CMSTextComponent },
          multi: true,
        },
        { provide: SfeAdapterService, useValue: instance(sfeAdapterMock) },
        { provide: CMSFacade, useValue: instance(cmsFacade) },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ContentPageletContainerComponent, { set: { entryComponents: [CMSTextComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageletContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    component.pageletId = 'id';
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`
<div class="content-pagelet" style="padding: 10px; border: 1px solid rgb(255, 255, 0);">
  <div class="content-pagelet-info" title="id">id (fq)</div>
</div>
`);
  });

  it('should render assigned template if name matches', () => {
    component.pageletId = 'cmsText';
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`<ish-cms-text><span>foo</span></ish-cms-text>`);
  });
});
