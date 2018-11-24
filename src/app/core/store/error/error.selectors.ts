import { CoreState } from '../core-store.module';

export const getErrorState = (state: CoreState) => (state.error && state.error.type ? state.error : undefined);
