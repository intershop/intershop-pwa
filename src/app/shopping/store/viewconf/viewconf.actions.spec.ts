import * as fromActions from './viewconf.actions';
import { ViewconfActionTypes } from './viewconf.actions';

describe('Viewconf Actions', () => {
  it('should create new action for ChangeViewType', () => {
    const payload = 'grid';
    const action = new fromActions.ChangeViewType(payload);

    expect({ ...action }).toEqual({
      type: ViewconfActionTypes.ChangeViewType,
      payload
    });
  });

  it('should create new action for ChangeSortBy', () => {
    const payload = 'name-asc';
    const action = new fromActions.ChangeSortBy(payload);

    expect({ ...action }).toEqual({
      type: ViewconfActionTypes.ChangeSortBy,
      payload
    });
  });

});
