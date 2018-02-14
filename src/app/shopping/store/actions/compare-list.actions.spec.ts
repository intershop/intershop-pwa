import * as fromActions from './compare-list.actions';
import { CompareListActionTypes } from './compare-list.actions';

describe('CompareList Actions', () => {
  it('should create new action for AddToCompareList', () => {
    const payload = '123';
    const action = new fromActions.AddToCompareList(payload);

    expect({ ...action }).toEqual({
      type: CompareListActionTypes.ADD_TO_COMPARE_LIST,
      payload
    });
  });

  it('should create new action for RemoveFromCompareList', () => {
    const payload = '123';
    const action = new fromActions.RemoveFromCompareList(payload);

    expect({ ...action }).toEqual({
      type: CompareListActionTypes.REMOVE_FROM_COMPARE_LIST,
      payload
    });
  });

});
