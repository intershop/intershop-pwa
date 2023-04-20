import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { ContentPageletEntryPointView, ContentPageletView } from 'ish-core/models/content-view/content-view.model';

@Component({
  selector: 'ish-content-designview-wrapper',
  templateUrl: './content-designview-wrapper.component.html',
  styleUrls: ['./content-designview-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentDesignviewWrapperComponent implements OnInit {
  // pagelet parameter
  @Input() pageletId: string;
  // slot parameters
  @Input() pagelet: ContentPageletView;
  @Input() slotId: string;
  // include parameter
  @Input() include: ContentPageletEntryPointView;

  pagelet$: Observable<ContentPageletView>;
  type: 'pagelet' | 'slot' | 'include';

  isDesignviewMode = true; // temporary activation switch

  constructor(private cmsFacade: CMSFacade) {}

  ngOnInit() {
    if (this.pageletId) {
      this.type = 'pagelet';
      this.pagelet$ = this.cmsFacade.pagelet$(this.pageletId);
    } else if (this.slotId) {
      this.type = 'slot';
    } else if (this.include) {
      this.type = 'include';
    }
  }

  action() {
    console.log('Design View button clicked');
  }
}
