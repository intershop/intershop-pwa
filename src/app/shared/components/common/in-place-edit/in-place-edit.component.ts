import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ish-in-place-edit',
  templateUrl: './in-place-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./in-place-edit.component.scss'],
})
export class InPlaceEditComponent implements AfterViewInit, OnDestroy {
  @Output() edited = new EventEmitter<void>();
  @Output() aborted = new EventEmitter<void>();

  private mode: 'view' | 'edit' = 'view';
  private destroy$ = new Subject<void>();

  hover: boolean;

  constructor(
    private host: ElementRef,
    private cdRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  // change into edit mode by clicking on the text
  ngAfterViewInit() {
    fromEvent(this.document, 'mousedown')
      .pipe(
        // only main button clicks
        filter((event: MouseEvent) => !event.button),
        map(({ target }) => this.host.nativeElement.contains(target)),
        takeUntil(this.destroy$)
      )
      .subscribe(click => {
        const newMode = click ? 'edit' : 'view';
        if (newMode === 'view' && newMode !== this.mode) {
          this.confirm();
        }
        this.mode = newMode;
        this.cdRef.detectChanges();
        if (this.mode === 'edit') {
          setTimeout(() => {
            this.host.nativeElement.querySelector('.form-control')?.focus();
          }, 200);
        }
      });
  }

  // change into edit mode by clicking the pen
  changeEditMode() {
    if (this.mode === 'edit') {
      setTimeout(() => {
        this.host.nativeElement.querySelector('.form-control')?.focus();
      }, 200);
    }
    if (this.mode === 'view') {
      this.confirm();
      this.mode = 'edit';
    }
  }

  confirm() {
    this.mode = 'view';
    this.edited.emit();
  }

  cancel() {
    this.mode = 'view';
    this.aborted.emit();
  }

  get viewMode() {
    return this.mode === 'view';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
