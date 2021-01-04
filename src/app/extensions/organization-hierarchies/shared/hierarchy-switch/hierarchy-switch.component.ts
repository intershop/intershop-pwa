import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

@Component({
  selector: 'ish-hierarchy-switch',
  templateUrl: './hierarchy-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class HierarchySwitchComponent implements OnInit {
  groups: Observable<OrganizationGroup[]>;
  count: Observable<number>;
  constructor(private facade: OrganizationHierarchiesFacade) {}

  ngOnInit(): void {
    this.groups = this.facade.groups$;
    this.count = this.facade.groupsCount$();
  }
}
