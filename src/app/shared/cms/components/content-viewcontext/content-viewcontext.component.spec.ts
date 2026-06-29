import { AsyncPipe, NgForOf } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import {
  ContentPageletEntryPointView,
  createContentPageletEntryPointView,
} from 'ish-core/models/content-view/content-view.model';
import { ContentPageletComponent } from 'ish-shared/cms/components/content-pagelet/content-pagelet.component';

import { ContentViewcontextComponent } from './content-viewcontext.component';

describe('Content Viewcontext Component', () => {
  let component: ContentViewcontextComponent;
  let fixture: ComponentFixture<ContentViewcontextComponent>;
  let element: HTMLElement;
  let entrypoint: ContentPageletEntryPointView;
  let cmsFacade: CMSFacade;

  beforeEach(async () => {
    entrypoint = createContentPageletEntryPointView({
      id: 'test.entrypoint',
      definitionQualifiedName: 'test.entrypoint-Include',
      domain: 'domain',
      displayName: 'displayName',
      resourceSetId: 'resId',
      configurationParameters: {
        key: '1',
      },
    });

    cmsFacade = mock(CMSFacade);
    when(cmsFacade.viewContext$(anything(), anything())).thenReturn(of(entrypoint));

    await TestBed.configureTestingModule({
      imports: [ContentViewcontextComponent],
      providers: [{ provide: CMSFacade, useValue: instance(cmsFacade) }],
    })
      .overrideComponent(ContentViewcontextComponent, {
        set: {
          imports: [MockComponent(ContentPageletComponent), AsyncPipe, NgForOf],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentViewcontextComponent);
    component = fixture.componentInstance;
    component.viewContextId = 'vc_foo_bar';
    component.callParameters = { Product: 'product_sku' };
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should pass resourceSetId to cmsFacade when provided', () => {
    when(cmsFacade.viewContext$(anything(), anything(), anything())).thenReturn(of(entrypoint));
    component.resourceSetId = 'custom_cartridge';
    component.ngOnChanges();

    verify(cmsFacade.viewContext$(anything(), anything(), anything())).once();
    const [, , resourceSetId] = capture(cmsFacade.viewContext$).last();
    expect(resourceSetId).toEqual('custom_cartridge');
  });

  it('should pass undefined resourceSetId to cmsFacade when not provided', () => {
    when(cmsFacade.viewContext$(anything(), anything(), anything())).thenReturn(of(entrypoint));
    component.ngOnChanges();

    verify(cmsFacade.viewContext$(anything(), anything(), anything())).once();
    const [, , resourceSetId] = capture(cmsFacade.viewContext$).last();
    expect(resourceSetId).toBeUndefined();
  });
});
