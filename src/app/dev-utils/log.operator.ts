import { tap } from 'rxjs/operators';

export const log = (message?: string) => tap(e => console.log(message || '', e));
