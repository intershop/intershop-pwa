import { ChangeDetectionStrategy, Component, OnInit, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { CoreState } from './core/store/core.state';
import { Storage } from './core/store/state.transfer';

@Component({
  selector: 'ish-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AppComponent implements OnInit {

  // DEBUG: prints the configured routes for routing analysis
  // constructor(private router: Router) { console.log('ROUTES: ', this.router.config); }

  constructor(
    private renderer: Renderer2,
    private store: Store<CoreState>,
  ) { }

  ngOnInit() {
    this.renderer.listen('window', 'storage', event => {
      this.store.dispatch(new Storage(event.key));
    });
  }
}
