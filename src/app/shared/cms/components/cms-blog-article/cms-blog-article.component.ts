import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CallParameters } from 'ish-core/models/call-parameters/call-parameters.model';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-blog-article',
  templateUrl: './cms-blog-article.component.html',
  styleUrls: ['./cms-blog-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSBlogArticleComponent implements CMSComponent {
  @Input() pagelet: ContentPageletView;
  @Input() callParameters: CallParameters;
}
