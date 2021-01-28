import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

import { HierarchySwitchComponent } from './hierarchy-switch.component';

describe('Hierarchy Switch Component', () => {
  let component: HierarchySwitchComponent;
  let fixture: ComponentFixture<HierarchySwitchComponent>;
  let element: HTMLElement;
  let organizationHierarchiesFacade: OrganizationHierarchiesFacade;

  const groupA = {
    id: 'root',
    name: 'ROOT',
  } as OrganizationGroup;
  const groupB = {
    id: 'child',
    name: 'CHILD',
  } as OrganizationGroup;

  beforeEach(async () => {
    organizationHierarchiesFacade = mock(OrganizationHierarchiesFacade);
    when(organizationHierarchiesFacade.groups$).thenReturn(of([groupA, groupB]));
    when(organizationHierarchiesFacade.groupsCount$()).thenReturn(of(2));
    when(organizationHierarchiesFacade.getSelectedGroup()).thenReturn(of(groupA));

    await TestBed.configureTestingModule({
      declarations: [HierarchySwitchComponent],
      imports: [NgbDropdownModule],
      providers: [
        { provide: OrganizationHierarchiesFacade, useFactory: () => instance(organizationHierarchiesFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchySwitchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not be rendered if there are no options', () => {
    when(organizationHierarchiesFacade.groups$).thenReturn(of([]));
    when(organizationHierarchiesFacade.groupsCount$()).thenReturn(of(0));
    fixture.detectChanges();
    expect(element.querySelector('.hierarchy-switch-current-selection')).toBeFalsy();
  });

  it('should be rendered on creation and show options', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('li')).toHaveLength(2);
    expect(element.querySelectorAll('li')).toMatchInlineSnapshot(`
      NodeList [
        <li><a class="dropdown-item d-block">ROOT</a></li>,
        <li><a class="dropdown-item d-block">CHILD</a></li>,
      ]
    `);
    expect(element.querySelector('.hierarchy-switch-current-selection').textContent).toMatchInlineSnapshot(`"ROOT"`);
  });

  it('should invoke select group at facade if a group has been selected', () => {
    fixture.componentInstance.groupSelected(groupA);
    verify(organizationHierarchiesFacade.selectGroup('root')).once();
  });

  it('should not invoke select group at facade if nothing was selected', () => {
    fixture.componentInstance.groupSelected(undefined);
    verify(organizationHierarchiesFacade.selectGroup('root')).never();
  });
});
