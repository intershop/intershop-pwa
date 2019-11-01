import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { contentReducers } from 'ish-core/store/content/content-store.module';
import { LoadContentIncludeSuccess } from 'ish-core/store/content/includes';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { getContentPagelet, getContentPageletEntities } from './pagelets.selectors';

describe('Pagelets Integration', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        reducers: {
          content: combineReducers(contentReducers),
        },
      }),
    });

    store$ = TestBed.get(TestStore);
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

    store$.dispatch(new LoadContentIncludeSuccess({ include: { id: 'id' } as ContentPageletEntryPoint, pagelets }));

    const entities = getContentPageletEntities(store$.state);
    expect(entities).not.toBeEmpty();
    expect(Object.keys(entities)).toIncludeAllMembers(['id']);
    expect(getContentPagelet()(store$.state, 'id')).toBeTruthy();
  });
});
