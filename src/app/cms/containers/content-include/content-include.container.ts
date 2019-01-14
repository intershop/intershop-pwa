import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-views';
import { LoadContentInclude, getContentInclude } from 'ish-core/store/content/includes';

import { CMSComponentBase } from '../../components/cms-component-base/cms-component-base';
@Component({
  selector: 'ish-content-include',
  templateUrl: './content-include.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentIncludeContainerComponent extends CMSComponentBase implements OnInit {
  @Input() includeId: string;

  contentInclude$: Observable<ContentPageletEntryPointView>;

  constructor(private store: Store<{}>) {
    super();
  }

  ngOnInit() {
    this.cmsDQNAttribute = this.includeId;
    this.contentInclude$ = this.store.pipe(select(getContentInclude, this.includeId));
    this.contentInclude$
      .pipe(
        take(1),
        filter(x => !x)
      )
      .subscribe(() => this.store.dispatch(new LoadContentInclude({ includeId: this.includeId })));
  }
}
