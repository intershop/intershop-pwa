import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
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
  
  /**
   * determines position of dropbox - dropup or dropdown, default is dropdown
   */
  @Input() placement: '' | 'up' = '';
  
  groups$: Observable<OrganizationGroup[]>;
  count$: Observable<number>;
  selectedElement: OrganizationGroup;

  constructor(private facade: OrganizationHierarchiesFacade) {}
  
  ngOnInit(): void {
    this.groups$ = this.facade.groups$;
    this.count$ = this.facade.groupsCount$();
    this.setSelectedElement();
  }

  groupSelected(group: OrganizationGroup): void {
    if (group) {
      this.facade.selectGroup(group.id);
    }
  }

  setSelectedElement(): void {
    this.facade.getSelectedGroup$.subscribe(el => this.selectedElement = el);
    if (!this.selectedElement)
    {
      this.groups$.subscribe(el => this.selectedElement = el[0]);
    }
  }

  getName(group: OrganizationGroup): string {
    let name = group.name;
    if(name.length>20)
    {
      return name.substring(0,20).concat('...');
    }
    return name;
  }
}
