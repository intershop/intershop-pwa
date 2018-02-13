import * as fromActions from './compare-list.actions';

describe('CompareList Actions', () => {
  it('AddToCompareList should create a new action', () => {
    const payload = '123';
    const action = new fromActions.AddToCompareList(payload);

    expect({ ...action }).toEqual({
      type: fromActions.ADD_TO_COMPARE_LIST,
      payload
    });
  });

  it('RemoveFromCompareList should create a new action', () => {
    const payload = '123';
    const action = new fromActions.RemoveFromCompareList(payload);

    expect({ ...action }).toEqual({
      type: fromActions.REMOVE_FROM_COMPARE_LIST,
      payload
    });
  });

});
