import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { identity, of } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { CMSService } from 'ish-core/services/cms/cms.service';
import { ContentStoreProviders } from 'ish-core/store/content/content-store.providers';
import { IncludesEffects } from 'ish-core/store/content/includes/includes.effects';
import { CoreStoreProviders } from 'ish-core/store/core/core-store.providers';
import { whenTruthy } from 'ish-core/utils/operators';
import { getContentInclude, loadContentInclude, loadContentIncludeSuccess } from './includes';

describe('Content Store', () => {
  let store: Store;
  const include = {
    definitionQualifiedName: 'dqn',
    displayName: 'Include',
    id: 'id',
    pageletIDs: ['1'],
  } as ContentPageletEntryPoint;
  const pagelet = {
    displayName: 'Pagelet',
  } as ContentPagelet;

  beforeEach(() => {
    const cmsService = mock(CMSService);
    when(cmsService.getContentInclude('id')).thenReturn(
      of({ include: { ...include }, pagelets: [{ ...pagelet, id: '1' }] })
    );

    TestBed.configureTestingModule({
      imports: [
        ContentStoreProviders.forTesting('includes', 'pagelets'),
        ...CoreStoreProviders.forTesting([], true),
        EffectsModule.forFeature([IncludesEffects]),
      ],
      providers: [
        { provide: CMSService, useFactory: () => instance(cmsService) },
        provideHttpClient(withInterceptorsFromDi()),
      ],
    });

    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should be properly memoized for content include selector', done => {
    const callback = { m: identity };
    const callbackSpy = spy(callback);

    store.pipe(select(getContentInclude('id')), whenTruthy()).subscribe(i => callback.m(i));

    store.dispatch(loadContentInclude({ includeId: 'id' }));
    store.dispatch(loadContentInclude({ includeId: 'id' }));

    expect(capture(callbackSpy.m).last()).toMatchInlineSnapshot(`
      [
        {
          "booleanParam": [Function],
          "configParam": [Function],
          "displayName": "Include",
          "domain": undefined,
          "hasParam": [Function],
          "id": "id",
          "numberParam": [Function],
          "pageletIDs": [
            "1",
          ],
          "resourceSetId": undefined,
          "seoAttributes": undefined,
          "stringParam": [Function],
        },
      ]
    `);

    verify(callbackSpy.m(anything())).once();

    const include2 = { id: 'id', displayName: 'Include 2', pageletIDs: ['2'] } as ContentPageletEntryPoint;
    store.dispatch(
      loadContentIncludeSuccess({
        include: { ...include2 },
        pagelets: [{ ...pagelet, id: '2' }],
      })
    );
    store.dispatch(
      loadContentIncludeSuccess({
        include: { ...include2 },
        pagelets: [{ ...pagelet, id: '2' }],
      })
    );

    expect(capture(callbackSpy.m).last()).toMatchInlineSnapshot(`
      [
        {
          "booleanParam": [Function],
          "configParam": [Function],
          "displayName": "Include 2",
          "domain": undefined,
          "hasParam": [Function],
          "id": "id",
          "numberParam": [Function],
          "pageletIDs": [
            "2",
          ],
          "resourceSetId": undefined,
          "seoAttributes": undefined,
          "stringParam": [Function],
        },
      ]
    `);

    verify(callbackSpy.m(anything())).twice();

    done();
  });
});
