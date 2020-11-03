import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { CallParameters } from 'ish-core/models/call-parameters/call-parameters.model';
import { ContentPageletEntryPointView } from 'ish-core/models/content-view/content-view.model';

/**
 * The Content ViewContext Component renders the content of the ViewContext
 * (identified by the 'viewContextId') for the current context
 * (given by the 'callParameters') if any content is available.
 *
 * @example
 * <ish-content-viewcontext
 *   viewContextId="vc_product_detail"
 *   [callParameters]="{ Product: product.sku, Category: category.categoryRef }"
 * ></ish-content-viewcontext>
 */
@Component({
  selector: 'ish-content-viewcontext',
  templateUrl: './content-viewcontext.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentViewcontextComponent implements OnChanges {
  /**
   * The ID of the View Context whose content is to be rendered.
   */
  @Input() viewContextId: string;

  /**
   * The call parameter object to provide the context, e.g. { Product: product.sku, Category: category.categoryRef }.
   */
  @Input() callParameters: CallParameters;

  viewContextEntrypoint$: Observable<ContentPageletEntryPointView>;

  constructor(private cmsFacade: CMSFacade) {}

  ngOnChanges() {
    this.viewContextEntrypoint$ = this.cmsFacade.viewContext$(this.viewContextId, this.callParameters);
  }
}
