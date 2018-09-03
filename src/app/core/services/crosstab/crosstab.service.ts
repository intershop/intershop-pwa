import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

import { Storage } from '../../store/local-storage-sync/local-storage-sync.reducer';

@Injectable({ providedIn: 'root' })
export class CrosstabService {
  constructor(private store: Store<{}>) {}

  listen() {
    if (typeof window !== 'undefined') {
      fromEvent(window, 'storage')
        .pipe(map((e: StorageEvent) => new Storage(e.key)))
        .subscribe(this.store);
    }
  }
}
