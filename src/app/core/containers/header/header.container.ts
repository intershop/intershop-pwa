import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { CoreState } from '../../store/core.state';
import { ErrorState } from '../../store/error/error.reducer';
import { getErrorState } from '../../store/error/error.selectors';

@Component({
  selector: 'ish-header-container',
  templateUrl: './header.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderContainerComponent implements OnInit {

  generalError$: Observable<ErrorState>;

  constructor(
    private store: Store<CoreState>
  ) { }

  ngOnInit() {
    this.generalError$ = this.store.pipe(select(getErrorState));
  }

}
