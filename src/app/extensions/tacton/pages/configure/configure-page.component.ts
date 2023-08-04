import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SelectedProductContextFacade } from 'ish-core/facades/selected-product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { TactonFacade } from '../../facades/tacton.facade';
import {
  TactonProductConfiguration,
  TactonProductConfigurationConflictItem,
  TactonProductConfigurationGroup,
} from '../../models/tacton-product-configuration/tacton-product-configuration.model';

@Component({
  selector: 'ish-configure-page',
  templateUrl: './configure-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ProductContextFacade, useClass: SelectedProductContextFacade }],
})
export class ConfigurePageComponent implements OnInit {
  @ViewChild('conflictResolutionDialog') conflictResolutionDialog: ModalDialogComponent<
    TactonProductConfigurationConflictItem[]
  >;

  state$: Observable<TactonProductConfiguration>;
  step$: Observable<TactonProductConfigurationGroup>;
  loading$: Observable<boolean>;
  product$: Observable<ProductView>;
  private destroyRef = inject(DestroyRef);

  constructor(private tactonFacade: TactonFacade, private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');

    this.state$ = this.tactonFacade.configureProduct$;
    this.step$ = this.tactonFacade.currentStep$;
    this.loading$ = this.tactonFacade.loading$;

    this.tactonFacade.conflicts$
      .pipe(
        whenTruthy(),
        filter(() => !!this.conflictResolutionDialog),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(conflicts => {
        this.conflictResolutionDialog.show(conflicts);
      });
  }

  acceptResolution() {
    this.tactonFacade.acceptConflictResolution();
  }
}
