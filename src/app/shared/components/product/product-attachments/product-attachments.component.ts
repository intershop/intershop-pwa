import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Attachment } from 'ish-core/models/attachment/attachment.model';

@Component({
  selector: 'ish-product-attachments',
  templateUrl: './product-attachments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAttachmentsComponent implements OnInit {
  attachments$: Observable<Attachment[]>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.attachments$ = this.context.select('product', 'attachments');
  }
}
