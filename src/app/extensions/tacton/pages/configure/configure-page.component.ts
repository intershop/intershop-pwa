import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { TactonFacade } from '../../facades/tacton.facade';
import {
  TactonProductConfiguration,
  TactonProductConfigurationConflictItem,
} from '../../models/tacton-product-configuration/tacton-product-configuration.model';

@Component({
  selector: 'ish-configure-page',
  templateUrl: './configure-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurePageComponent implements OnInit, OnDestroy {
  @ViewChild('conflictResolutionDialog') conflictResolutionDialog: ModalDialogComponent<
    TactonProductConfigurationConflictItem[]
  >;

  state$: Observable<TactonProductConfiguration>;
  step$: Observable<unknown>;
  loading$: Observable<boolean>;
  product$: Observable<ProductView>;
  private destroy$ = new Subject();

  constructor(private tactonFacade: TactonFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.product$ = this.shoppingFacade.selectedProduct$;
    this.state$ = this.tactonFacade.configureProduct$;
    this.step$ = this.tactonFacade.currentStep$;
    this.loading$ = this.tactonFacade.loading$;

    this.tactonFacade.conflicts$
      .pipe(
        whenTruthy(),
        filter(() => !!this.conflictResolutionDialog),
        takeUntil(this.destroy$)
      )
      .subscribe(conflicts => {
        this.conflictResolutionDialog.show(conflicts);
      });
  }

  acceptResolution() {
    this.tactonFacade.acceptConflictResolution();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
