import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CoreState, getCurrentError } from '../../../core/store/error';
import { ErrorState } from '../../store/error/error.reducer';


@Component({
  selector: 'ish-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit {

  constructor(
    private store: Store<CoreState>
  ) { }

  cartItems: string[] = [];
  navbarCollapsed = true;

  generalError$;

  ngOnInit() {
    // TODO: fetch cartItems from store
    this.generalError$ = this.store.pipe(select(getCurrentError));
  }
}
