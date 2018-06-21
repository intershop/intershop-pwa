import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { resolveRouteHeaderType } from '../../../../utils/router';
import { CoreState } from '../../../store/core.state';

@Component({
  selector: 'ish-header-container',
  templateUrl: './header.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderContainerComponent implements OnInit {
  headerType$: Observable<string>;

  constructor(private store: Store<CoreState>, private router: Router) {}

  ngOnInit() {
    this.headerType$ = resolveRouteHeaderType<string>(this.router);
  }
}
