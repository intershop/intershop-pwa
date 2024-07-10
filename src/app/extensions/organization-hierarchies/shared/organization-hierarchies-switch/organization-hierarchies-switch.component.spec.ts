import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import { OrganizationHierarchiesGroup } from '../../models/organization-hierarchies-group/organization-hierarchies-group.model';

import { OrganizationHierarchiesSwitchComponent } from './organization-hierarchies-switch.component';

describe('Organization Hierarchies Switch Component', () => {
  let component: OrganizationHierarchiesSwitchComponent;
  let fixture: ComponentFixture<OrganizationHierarchiesSwitchComponent>;
  let element: HTMLElement;
  let organizationHierarchiesFacade: OrganizationHierarchiesFacade;

  const groupA = {
    id: 'root',
    displayName: 'ROOT',
  } as OrganizationHierarchiesGroup;
  const groupB = {
    id: 'child',
    displayName: 'CHILD',
  } as OrganizationHierarchiesGroup;

  beforeEach(async () => {
    organizationHierarchiesFacade = mock(OrganizationHierarchiesFacade);
    when(organizationHierarchiesFacade.groups$).thenReturn(of([groupA, groupB]));
    when(organizationHierarchiesFacade.groupsCount$()).thenReturn(of(2));
    when(organizationHierarchiesFacade.getSelectedGroup$).thenReturn(of(groupA));

    await TestBed.configureTestingModule({
      declarations: [OrganizationHierarchiesSwitchComponent],
      imports: [NgbDropdownModule, RouterTestingModule],
      providers: [
        { provide: OrganizationHierarchiesFacade, useFactory: () => instance(organizationHierarchiesFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationHierarchiesSwitchComponent);
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
    expect(element.querySelector('.hierarchy-switch-current-selection').textContent).toMatchInlineSnapshot(`"ROOT"`);
  });

  it('should invoke select group at facade if a group has been selected', () => {
    fixture.componentInstance.groupSelected(groupA);
    verify(organizationHierarchiesFacade.assignGroup('root')).once();
  });

  it('should not invoke select group at facade if nothing was selected', () => {
    fixture.componentInstance.groupSelected(undefined);
    verify(organizationHierarchiesFacade.assignGroup('root')).never();
  });
});
