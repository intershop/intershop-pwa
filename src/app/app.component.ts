import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { map } from 'rxjs/operators';
import { CoreState } from './core/store/core.state';
import { Storage } from './core/store/local-storage-sync/local-storage-sync.reducer';

@Component({
  selector: 'ish-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AppComponent implements OnInit {

  // DEBUG: prints the configured routes for routing analysis
  // constructor(private router: Router) { console.log('ROUTES: ', this.router.config); }

  constructor(
    private store: Store<CoreState>,
  ) { }

  ngOnInit() {
    fromEvent(window, 'storage').pipe(
      map((e: StorageEvent) => new Storage(e.key))
    ).subscribe(this.store);
  }
}
