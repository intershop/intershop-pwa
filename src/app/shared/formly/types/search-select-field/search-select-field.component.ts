import { AsyncPipe, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Renderer2, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';

import { SelectOption } from 'ish-core/models/select-option/select-option.model';

/**
 * Type for a searchable select field
 */

@Component({
  selector: 'ish-search-select-field',
  templateUrl: './search-select-field.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [AsyncPipe, FormlySelectModule, NgClass, NgSelectModule, ReactiveFormsModule],
})
export class SearchSelectFieldComponent extends FieldType<FieldTypeConfig> implements AfterViewInit {
  @ViewChild(NgSelectComponent) ngSelect: NgSelectComponent;

  defaultOptions = {
    props: {
      options: [] as SelectOption[],
    },
  };

  constructor(private renderer: Renderer2) {
    super();
  }

  // set the id on the search input for accessibility reasons
  ngAfterViewInit() {
    const inputElement = this.ngSelect?.searchInput?.nativeElement;
    if (inputElement) {
      this.renderer.setAttribute(inputElement, 'id', this.id);
    }
  }
}
