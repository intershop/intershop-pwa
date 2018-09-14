import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { ContentInclude } from '../../../models/content-include/content-include.model';
import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';
import { TestStore, ngrxTesting } from '../../../utils/dev/ngrx-testing';
import { contentReducers } from '../content.system';
import { LoadContentIncludeSuccess } from '../includes';

import { getContentPageletEntities } from './pagelets.selectors';

describe('Pagelets Integration', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        content: combineReducers(contentReducers),
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
        configurationParameters: {},
        definitionQualifiedName: 'fq',
        displayName: 'name',
        id: 'id',
        slots: [],
      },
    ];

    store$.dispatch(new LoadContentIncludeSuccess({ include: { id: 'id' } as ContentInclude, pagelets }));

    const entities = getContentPageletEntities(store$.state);
    expect(entities).not.toBeEmpty();
    expect(Object.keys(entities)).toIncludeAllMembers(['id']);
  });
});
