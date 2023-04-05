import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject, take, takeUntil } from 'rxjs';

export interface ModalOptions extends NgbModalOptions {
  /**
   * Modal title string.
   */
  titleText?: string;
  /**
   * Optional modal confirm button text.
   */
  confirmText?: string;
  /**
   * Optional modal confirm button disabled.
   */
  confirmDisabled?: boolean;
  /**
   * Optional modal reject button text.
   */
  rejectText?: string;
}

/**
 * The Modal Dialog Component displays a generic (ng-bootstrap) modal, that shows a custom title and custom content.
 * It provides an optional footer that includes confirm and reject buttons.
 * It is possible to pass any data on show.
 * The also provided confirmed output emitter will return the previously passed data if the modal gets confirmed.
 *
 * @see https://ng-bootstrap.github.io/#/components/modal/api#NgbModal
 *
 * @example
 * <ish-modal-dialog [options]="options" (confirmed)="onConfirmed($event)">
 *   Dummy content
 * </ish-modal-dialog>
 */
@Component({
  selector: 'ish-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialogComponent<T> implements OnDestroy {
  @Input() options: ModalOptions;

  @Output() confirmed = new EventEmitter<T>();

  @Output() closed = new EventEmitter<T>();

  @Output() shown = new EventEmitter<T>();

  @ViewChild('template') modalDialogTemplate: TemplateRef<unknown>;

  ngbModalRef: NgbModalRef;

  data: T;

  private destroy$ = new Subject<void>();

  constructor(private ngbModal: NgbModal) {}

  /**
   * Configure and show modal dialog.
   */
  show(data?: T) {
    this.data = data ? data : undefined;

    this.ngbModalRef = this.ngbModal.open(this.modalDialogTemplate, this.options);

    this.ngbModalRef.dismissed.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => this.closed.emit(this.data));

    this.shown.emit(this.data);
  }

  /**
   * Hides modal dialog.
   */
  hide() {
    this.ngbModalRef.close();
    this.destroy$.next();
    this.closed.emit(this.data);
  }

  /**
   * Emits input data or undefined and hides modal.
   */
  confirm() {
    this.confirmed.emit(this.data);
    this.hide();
  }

  /**
   * Scrolls to an anchor element
   *
   * @param anchor The ID of the anchor element.
   */
  scrollToAnchor(anchor: string) {
    if (this.options.scrollable) {
      const element = document.getElementById(anchor);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }, 200);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
