import * as fromActions from './compare.actions';

describe('Compare Actions', () => {
  it('should create new action for AddToCompare', () => {
    const payload = '123';
    const action = new fromActions.AddToCompare(payload);

    expect({ ...action }).toEqual({
      type: fromActions.CompareActionTypes.AddToCompare,
      payload
    });
  });

  it('should create new action for RemoveFromCompare', () => {
    const payload = '123';
    const action = new fromActions.RemoveFromCompare(payload);

    expect({ ...action }).toEqual({
      type: fromActions.CompareActionTypes.RemoveFromCompare,
      payload
    });
  });

});
