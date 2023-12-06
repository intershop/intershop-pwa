import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

@Component({
  selector: 'ish-hierarchy-group-name',
  templateUrl: './hierarchy-group-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class HierarchyGroupNameComponent implements OnInit {
  @Input() buyingContext: string;
  @Input() showLabel: boolean;
  group$: Observable<OrganizationGroup>;

  constructor(private facade: OrganizationHierarchiesFacade) {}

  ngOnInit() {
    if (this.buyingContext) {
      this.group$ = this.facade.getDetailsOfGroup$(this.buyingContext.split('@')[0]);
    }
  }
}
