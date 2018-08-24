import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ContentInclude } from '../../../models/content-include/content-include.model';
import { LoadContentInclude, getContentInclude } from '../../store/includes';

@Component({
  selector: 'ish-content-include',
  templateUrl: './content-include.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentIncludeContainerComponent implements OnInit {
  @Input()
  includeId: string;

  contentInclude$: Observable<ContentInclude>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.store.dispatch(new LoadContentInclude(this.includeId));
    this.contentInclude$ = this.store.pipe(select(getContentInclude, { includeId: this.includeId }));
  }
}
