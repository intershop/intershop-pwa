import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { ContentEntryPointView, ContentPageletEntryPointView } from 'ish-core/models/content-view/content-views';
import { LoadContentInclude, getContentInclude } from 'ish-core/store/content/includes';
import { SfeMetadataWrapper } from '../../../cms/sfe-adapter/sfe-metadata-wrapper';
import { SfeMapper } from '../../../cms/sfe-adapter/sfe.mapper';

@Component({
  selector: 'ish-content-include',
  templateUrl: './content-include.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentIncludeContainerComponent extends SfeMetadataWrapper implements OnInit {
  @Input() includeId: string;

  constructor(private store: Store<{}>, private cd: ChangeDetectorRef) {
    super();
  }

  contentInclude$: Observable<ContentPageletEntryPointView>;

  ngOnInit() {
    this.contentInclude$ = this.store.pipe(select(getContentInclude, this.includeId));

    this.contentInclude$.pipe(filter(include => !!include)).subscribe(include => {
      this.setSfeMetadata(SfeMapper.mapIncludeViewToSfeMetadata(include));
      this.cd.markForCheck();
    });

    this.contentInclude$
      .pipe(
        take(1),
        filter(x => !x)
      )
      .subscribe(() => this.store.dispatch(new LoadContentInclude({ includeId: this.includeId })));
  }
}
