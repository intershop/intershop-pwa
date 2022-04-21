import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';

@Component({
  selector: 'ish-blog-article-page',
  templateUrl: './blog-article-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogArticlePageComponent implements OnInit {
  pagelet$: Observable<ContentPageletView>;

  constructor(private cmsFacade: CMSFacade) {}

  ngOnInit() {
    this.pagelet$ = this.cmsFacade.contentPagelet$;
  }
}
