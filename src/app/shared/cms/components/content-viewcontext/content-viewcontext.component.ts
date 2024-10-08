import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges } from '@angular/core';
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
  @Input({ required: true }) viewContextId: string;

  /**
   * The call parameter object to provide the context, e.g. { Product: product.sku, Category: category.categoryRef }.
   */
  @Input({ required: true }) callParameters: CallParameters;

  viewContextEntrypoint$: Observable<ContentPageletEntryPointView>;

  constructor(private cmsFacade: CMSFacade, private hostElement: ElementRef) {}

  ngOnChanges() {
    this.viewContextEntrypoint$ = this.cmsFacade.viewContext$(this.viewContextId, this.callParameters);

    // the 'callparametersstring' attribute is needed for the Design View - do not remove this code
    this.hostElement.nativeElement.setAttribute(
      'callparametersstring',
      Object.keys(this.callParameters)
        .map(key => `${key}=${this.callParameters[key]}`)
        .join('&')
    );
  }
}
