import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { deepEqual, instance, mock, spy, verify } from 'ts-mockito';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { contentReducers } from 'ish-core/store/content/content-store.module';
import { LoadContentInclude, LoadContentIncludeSuccess } from 'ish-core/store/content/includes';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { ContentPageletContainerComponent } from 'ish-shared/cms/containers/content-pagelet/content-pagelet.container';
import { SfeAdapterService } from 'ish-shared/cms/sfe-adapter/sfe-adapter.service';

import { ContentIncludeContainerComponent } from './content-include.container';

describe('Content Include Container', () => {
  let component: ContentIncludeContainerComponent;
  let fixture: ComponentFixture<ContentIncludeContainerComponent>;
  let element: HTMLElement;
  let include: ContentPageletEntryPoint;
  let store$: Store<{}>;
  let sfeAdapterMock: SfeAdapterService;

  beforeEach(async(() => {
    include = {
      id: 'test.include',
      definitionQualifiedName: 'test.include-Include',
      domain: 'domain',
      displayName: 'displayName',
      resourceSetId: 'resId',
      configurationParameters: {
        key: '1',
      },
    };

    sfeAdapterMock = mock(SfeAdapterService);

    TestBed.configureTestingModule({
      declarations: [ContentIncludeContainerComponent, MockComponent(ContentPageletContainerComponent)],
      imports: ngrxTesting({
        ...coreReducers,
        content: combineReducers(contentReducers),
      }),
      providers: [{ provide: SfeAdapterService, useValue: instance(sfeAdapterMock) }],
    }).compileComponents();

    store$ = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentIncludeContainerComponent);
    component = fixture.componentInstance;
    component.includeId = include.id;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should dispatch a content loading action on ngOnInit', () => {
    const storeSpy$ = spy(store$);

    fixture.detectChanges();

    verify(storeSpy$.dispatch(deepEqual(new LoadContentInclude({ includeId: 'test.include' })))).once();
  });

  describe('with content', () => {
    beforeEach(() => {
      fixture.detectChanges();
      store$.dispatch(new LoadContentIncludeSuccess({ include, pagelets: [] }));
    });

    it('should have the matching include available for rendering', done => {
      component.contentInclude$.subscribe(inc => {
        expect(inc.id).toEqual('test.include');
        expect(inc.numberParam('key')).toBe(1);
        done();
      });
    });
  });
});
