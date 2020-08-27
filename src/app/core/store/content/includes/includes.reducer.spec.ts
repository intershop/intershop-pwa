import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { loadContentInclude, loadContentIncludeFail, loadContentIncludeSuccess } from './includes.actions';
import { includesReducer, initialState } from './includes.reducer';

describe('Includes Reducer', () => {
  it('should be empty when nothing was reduced', () => {
    expect(initialState.entities).toBeEmpty();
    expect(initialState.ids).toBeEmpty();
    expect(initialState.loading).toBeFalse();
  });

  it('should set loading state when reducing LoadContentInclude', () => {
    const newState = includesReducer(initialState, loadContentInclude({ includeId: '' }));

    expect(newState.entities).toBeEmpty();
    expect(newState.ids).toBeEmpty();
    expect(newState.loading).toBeTrue();
  });

  describe('after begin loading', () => {
    let loadingState;

    beforeEach(() => {
      loadingState = includesReducer(initialState, loadContentInclude({ includeId: '' }));
    });

    it('should unset loading state when reducing LoadContentIncludeFail', () => {
      const newState = includesReducer(
        loadingState,
        loadContentIncludeFail({ error: makeHttpError({ message: 'ERROR' }) })
      );

      expect(newState.entities).toBeEmpty();
      expect(newState.ids).toBeEmpty();
      expect(newState.loading).toBeFalse();
    });

    it('should add include when reducing LoadContentIncludeSuccess', () => {
      const newState = includesReducer(
        loadingState,
        loadContentIncludeSuccess({ include: { id: 'dummy' } as ContentPageletEntryPoint, pagelets: [] })
      );

      expect(newState.entities).toHaveProperty('dummy');
      expect(newState.ids).toHaveLength(1);
      expect(newState.loading).toBeFalse();
    });
  });

  describe('loading multiple includes', () => {
    const IDS = ['dummy1', 'dummy2', 'dummy3'];
    let state = initialState;

    beforeEach(() => {
      IDS.forEach(
        title =>
          (state = includesReducer(
            state,
            loadContentIncludeSuccess({ include: { id: title } as ContentPageletEntryPoint, pagelets: [] })
          ))
      );
    });

    it('should contain all includes when loading multiple items', () => {
      IDS.forEach(id => expect(state.entities).toHaveProperty(id));
      expect(state.ids).toIncludeAllMembers(IDS);
      expect(state.ids).toHaveLength(IDS.length);
    });
  });
});
