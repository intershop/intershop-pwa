import { CoreState } from '../core.state';

export const getErrorState = (state: CoreState) => (state.error && state.error.type ? state.error : undefined);
