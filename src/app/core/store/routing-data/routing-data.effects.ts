import { Injectable } from '@angular/core';
import { ActivationStart, NavigationEnd, Router } from '@angular/router';
import { Effect } from '@ngrx/effects';
import { debounce, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { SetRoutingData } from './routing-data.actions';

@Injectable()
export class RoutingDataEffects {
  constructor(private router: Router) {}

  private navEnd$ = this.router.events.pipe(filter(event => event instanceof NavigationEnd));

  /**
   * subscribes to all routing activations and reads data from the last one when navigation is finished
   */
  @Effect()
  acquireRouteData$ = this.router.events.pipe(
    filter(event => event instanceof ActivationStart),
    debounce(() => this.navEnd$),
    map((event: ActivationStart) => event.snapshot.data),
    distinctUntilChanged(),
    map(data => new SetRoutingData(data))
  );
}
