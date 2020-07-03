import { TestBed } from '@angular/core/testing';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ContentStoreModule } from 'ish-core/store/content/content-store.module';
import { loadContentIncludeSuccess } from 'ish-core/store/content/includes';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { getContentPagelet, getContentPageletEntities } from './pagelets.selectors';

describe('Pagelets Integration', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContentStoreModule.forTesting('pagelets'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  it('should be empty on application start', () => {
    expect(getContentPageletEntities(store$.state)).toBeEmpty();
  });

  it('should contain pagelets when they are loaded', () => {
    const pagelets: ContentPagelet[] = [
      {
        definitionQualifiedName: 'fq',
        id: 'id',
        domain: 'domain',
        displayName: 'name',
      },
    ];

    store$.dispatch(loadContentIncludeSuccess({ include: { id: 'id' } as ContentPageletEntryPoint, pagelets }));

    const entities = getContentPageletEntities(store$.state);
    expect(entities).not.toBeEmpty();
    expect(Object.keys(entities)).toIncludeAllMembers(['id']);
    expect(getContentPagelet('id')(store$.state)).toBeTruthy();
  });
});
