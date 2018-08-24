import { ContentInclude } from '../../../models/content-include/content-include.model';
import { HttpError } from '../../../models/http-error/http-error.model';

import * as fromActions from './includes.actions';

describe('Includes Actions', () => {
  describe('Load Content Include Actions', () => {
    it('should create new action for LoadContentInclude', () => {
      const payload = 'pwa.include.pagelet2-Include';
      const action = new fromActions.LoadContentInclude(payload);

      expect({ ...action }).toEqual({
        type: fromActions.IncludesActionTypes.LoadContentInclude,
        payload,
      });
    });

    it('should create new action for LoadContentIncludeFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.LoadContentIncludeFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.IncludesActionTypes.LoadContentIncludeFail,
        payload,
      });
    });

    it('should create new action for LoadContentIncludeSuccess', () => {
      const payload = {
        id: 'pwa.include',
        displayName: 'pwa.include',
        definitionQualifiedName: 'app_sf_pwa:pwa.include.pagelet2-Include',
        pagelets: [],
      } as ContentInclude;
      const action = new fromActions.LoadContentIncludeSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.IncludesActionTypes.LoadContentIncludeSuccess,
        payload,
      });
    });
  });
});
