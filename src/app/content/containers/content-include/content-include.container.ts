import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { ContentIncludeView } from '../../../models/content-view/content-views';
import { LoadContentInclude, getContentInclude } from '../../store/includes';

@Component({
  selector: 'ish-content-include',
  templateUrl: './content-include.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentIncludeContainerComponent implements OnInit {
  @Input()
  includeId: string;

  contentInclude$: Observable<ContentIncludeView>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.contentInclude$ = this.store.pipe(select(getContentInclude, this.includeId));
    this.contentInclude$
      .pipe(
        take(1),
        filter(x => !x)
      )
      .subscribe(() => this.store.dispatch(new LoadContentInclude(this.includeId)));
  }
}
