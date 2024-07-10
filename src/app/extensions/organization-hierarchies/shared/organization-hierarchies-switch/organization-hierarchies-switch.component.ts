import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import { OrganizationHierarchiesGroup } from '../../models/organization-hierarchies-group/organization-hierarchies-group.model';

/**
 * Component to display a selectbox for organization hierarchies groups in the header.
 * Used in {@link LoginStatusComponent}.
 */
@Component({
  selector: 'ish-organization-hierarchies-switch',
  templateUrl: './organization-hierarchies-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationHierarchiesSwitchComponent implements OnInit {
  /**
   * determines position of dropbox - dropup or dropdown, default is dropdown
   */
  @Input() placement: '' | 'up' = '';

  groups$: Observable<OrganizationHierarchiesGroup[]>;
  count$: Observable<number>;
  selectedElement$: Observable<OrganizationHierarchiesGroup>;

  constructor(private facade: OrganizationHierarchiesFacade) {}

  ngOnInit(): void {
    this.groups$ = this.facade.groups$;
    this.count$ = this.facade.groupsCount$();
    this.setSelectedElement();
  }

  groupSelected(group: OrganizationHierarchiesGroup): void {
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
