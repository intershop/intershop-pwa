import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';

/**
 * component for setting the breadcrumb trail of a specific page
 *
 * Breadcrumbs can be set in two specific ways:
 * - setting the 'breadcrumbData' field as routing data
 * - dispatching a setBreadcrumbData action in an effect
 */
@Component({
  selector: 'ish-breadcrumb',
  imports: [AsyncPipe, NgClass, RouterLink, TranslatePipe],
  standalone: true,
  templateUrl: './breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements OnInit {
  @Input() separator: string;
  @Input() showHome = true;
  @Input() account: boolean;

  trail$: Observable<BreadcrumbItem[]>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.trail$ = this.appFacade.breadcrumbData$;
  }

  /**
   * Bootstrap divider override. A provided separator (including an empty string to remove the divider)
   * sets the '--bs-breadcrumb-divider' custom property; otherwise the Bootstrap default is used.
   */
  get dividerStyle(): Record<string, string> {
    if (typeof this.separator !== 'string') {
      return {};
    }
    // escape backslashes and single quotes so the value stays a valid quoted CSS string
    const escaped = this.separator.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return { '--bs-breadcrumb-divider': `'${escaped}'` };
  }
}
