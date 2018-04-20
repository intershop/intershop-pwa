// tslint:disable:ccp-no-markup-in-containers
// tslint:disable:ccp-no-intelligence-in-components
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ContentInclude } from '../../../models/content-include/content-include.model';
import { ContentIncludesService } from '../../services/content-includes/content-includes.service';

@Component({
  selector: 'ish-content-include',
  templateUrl: './content-include.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ContentIncludeContainerComponent implements OnInit {
  @Input()
  includeId: string;

  contentInclude: ContentInclude = {} as ContentInclude;

  constructor(private contentIncludeService: ContentIncludesService) {}

  ngOnInit() {
    this.contentIncludeService.getContentInclude(this.includeId).subscribe(contentInclude => {
      this.contentInclude = contentInclude;
    });
  }
}
