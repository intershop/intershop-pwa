import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CoreState } from './core/store/core.state';
import { getRoutingData } from './core/store/routing-data';

@Component({
  selector: 'ish-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  className$: Observable<string>;

  constructor(private store: Store<CoreState>) {}

  ngOnInit() {
    this.className$ = this.store.pipe(select(getRoutingData('className')));
  }
}
