import * as fromActions from './viewconf.actions';

describe('Viewconf Actions', () => {
  it('should create new action for ChangeViewType', () => {
    const payload = 'grid';
    const action = new fromActions.ChangeViewType(payload);

    expect({ ...action }).toEqual({
      type: fromActions.ViewconfActionTypes.ChangeViewType,
      payload
    });
  });

  it('should create new action for ChangeSortBy', () => {
    const payload = 'name-asc';
    const action = new fromActions.ChangeSortBy(payload);

    expect({ ...action }).toEqual({
      type: fromActions.ViewconfActionTypes.ChangeSortBy,
      payload
    });
  });

  it('should create new action for SetSortKeys', () => {
    const payload = ['name-asc', 'name-desc'];
    const action = new fromActions.SetSortKeys(payload);

    expect({ ...action }).toEqual({
      type: fromActions.ViewconfActionTypes.SetSortKeys,
      payload
    });
  });

});
