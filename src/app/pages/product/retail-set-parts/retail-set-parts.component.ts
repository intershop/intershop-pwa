import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { ProductItemDisplayType } from 'ish-shared/components/product/product-item/product-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from '../../../core/directives.module';
import { SharedModule } from 'ish-shared/shared.module';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'ish-retail-set-parts',
    templateUrl: './retail-set-parts.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        SharedModule,
        DirectivesModule,
        AsyncPipe,
        TranslateModule,
    ],
})
export class RetailSetPartsComponent implements OnInit {
  @Input() displayType: ProductItemDisplayType = 'row';

  parts$: Observable<SkuQuantityType[]>;
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.parts$ = this.context.select('parts');
    this.visible$ = this.context.select('displayProperties', 'retailSetParts');
  }
}
