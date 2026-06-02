import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { Attachment } from 'ish-core/models/attachment/attachment.model';

@Component({
  selector: 'ish-product-attachments',
  templateUrl: './product-attachments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, TranslatePipe],
})
export class ProductAttachmentsComponent implements OnInit {
  attachments$: Observable<Attachment[]>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.attachments$ = this.context.select('product', 'attachments');
  }
}
