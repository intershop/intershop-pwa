import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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
  selectedElement$: Observable<OrganizationGroup>;

  constructor(private facade: OrganizationHierarchiesFacade) {}

  homeHref: string;

  ngOnInit(): void {
    this.groups$ = this.facade.groups$;
    this.count$ = this.facade.groupsCount$();
    this.setSelectedElement();
  }

  groupSelected(group: OrganizationGroup): void {
    if (group) {
      this.facade.assignGroup(group.id);
    }
  }

  setSelectedElement(): void {
    this.selectedElement$ = this.facade.getSelectedGroup$.pipe(
      switchMap(selectedElement =>
        selectedElement
          ? of(selectedElement)
          : this.groups$.pipe(map(groups => (groups?.length ? groups[0] : undefined)))
      )
    );
  }
}
