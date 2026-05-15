import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject, race, take } from 'rxjs';
import { v4 as uuid } from 'uuid';

export interface ModalOptions extends NgbModalOptions {
  /** Modal Title */
  titleText?: string;

  /** Modal confirm button Label. */
  confirmText?: string;

  /** Modal confirm button disabled. */
  confirmDisabled?: boolean;

  /** Modal reject button Label. */
  rejectText?: string;

  /** Icon properties to display an icon in front of the title, e.g. 'exclamation-triangle-fill' */
  icon?: string;

  /**  Icon styling classes, e.g. iconClass: 'text-warning pe-2' */
  iconClass?: string;
}

/**
 * The Modal Dialog Component displays a generic (ng-bootstrap) modal.
 * It supports two mutually exclusive usage modes:
 *
 * **Mode 1 – Options-driven (simple):**
 * The dialog header (title, icon, close button) and footer (confirm/reject buttons) are rendered
 * automatically based on the `[options]` input. Provide your content as plain `ng-content`,
 * which will be placed inside the modal body.
 *
 * @example
 * <ish-modal-dialog [options]="{ titleText: 'Confirm', confirmText: 'OK', rejectText: 'Cancel' }"
 *                   (confirmed)="onConfirmed($event)">
 *   <p>Are you sure?</p>
 * </ish-modal-dialog>
 *
 * ---
 *
 * **Mode 2 – Custom sections (advanced):**
 * For full control, project elements with a `header` and/or `body` attribute.
 * When provided, these replace the corresponding options-driven sections entirely.
 *
 * - `[header]` replaces the entire modal header (title, icon, close button).
 * - `[body]` replaces the entire modal body AND footer (you must provide your own buttons).
 *
 * @example
 * <!-- Custom body (including footer), options-driven header -->
 * <ish-modal-dialog [options]="{ titleText: 'Info' }">
 *   <div body>
 *     <div class="modal-body">Full control over body and footer.</div>
 *     <div class="modal-footer"><button (click)="doSomething()">Custom Action</button></div>
 *   </div>
 * </ish-modal-dialog>
 *
 * @see https://ng-bootstrap.github.io/#/components/modal/api#NgbModal
 */
@Component({
  selector: 'ish-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialogComponent<T> implements OnDestroy {
  @Input({ required: true }) options: ModalOptions;

  @Output() readonly confirmed = new EventEmitter<T>();

  @Output() readonly closed = new EventEmitter<T>();

  @Output() readonly shown = new EventEmitter<T>();

  @ViewChild('template') modalDialogTemplate: TemplateRef<unknown>;

  // visible-for-testing
  ngbModalRef: NgbModalRef;

  data: T;

  uuid = uuid();

  private hide$ = new Subject<void>();

  private destroyRef = inject(DestroyRef);

  constructor(
    private ngbModal: NgbModal,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Configure and show modal dialog.
   */
  show(data?: T) {
    this.data = data ? data : undefined;

    this.ngbModalRef = this.ngbModal.open(this.modalDialogTemplate, {
      ...this.options,
      ariaLabelledBy: this.options.titleText ? `modal-title-${this.uuid}` : this.options.ariaLabelledBy,
    });

    race(this.ngbModalRef.dismissed, this.hide$)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.closed.emit(this.data);
      });

    this.shown.emit(this.data);
  }

  /**
   * Hides modal dialog.
   */
  hide() {
    this.ngbModalRef.close();
    this.hide$.next();
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
  // not-dead-code
  scrollToAnchor(anchor: string) {
    if (this.options.scrollable) {
      const element = this.document.getElementById(anchor);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }, 200);
      }
    }
  }

  ngOnDestroy(): void {
    this.hide$.complete(); // complete open hide$ subscription
  }
}
