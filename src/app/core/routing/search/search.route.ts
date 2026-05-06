import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { Store } from '@ngrx/store';

import { addSearchTermToSuggestion } from 'ish-core/store/shopping/search';

export const prefetchSearchPage: CanMatchFn = (_route, segments) => {
  const searchTerm = segments?.[0]?.path === 'search' ? segments[1]?.path : undefined;

  if (searchTerm) {
    inject(Store).dispatch(addSearchTermToSuggestion({ searchTerm }));
  }

  return true;
};
