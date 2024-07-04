import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'ish-in-place-edit',
  templateUrl: './in-place-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./in-place-edit.component.scss'],
})
export class InPlaceEditComponent implements AfterViewInit {
  // localization key, can be used to give the edit-pen icon a more descriptive aria label that describes what will be edited when clicking it
  @Input() ariaLabelName = '';

  @Output() edited = new EventEmitter<void>();
  @Output() aborted = new EventEmitter<void>();

  private mode: 'view' | 'edit' = 'view';
  private destroyRef = inject(DestroyRef);

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
        takeUntilDestroyed(this.destroyRef)
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
}
