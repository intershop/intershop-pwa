import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

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
    when(organizationHierarchiesFacade.groupsCount$).thenReturn(of(2));

    await TestBed.configureTestingModule({
      declarations: [HierarchySwitchComponent],
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
    when(organizationHierarchiesFacade.groupsCount$).thenReturn(of(0));
    fixture.detectChanges();
    expect(element.querySelector('select[data-testing-id=hierarchy-switch]')).toBeFalsy();
  });

  it('should be rendered on creation and show options', () => {
    fixture.detectChanges();
    expect(element.querySelector('select[data-testing-id=hierarchy-switch]')).toBeTruthy();
    expect(element.querySelector('select[data-testing-id=hierarchy-switch] option[value = root ]')).toBeTruthy();
    expect(element.querySelector('select[data-testing-id=hierarchy-switch] option[value = root ]').innerHTML).toContain(
      'ROOT'
    );
    expect(
      element.querySelector('select[data-testing-id=hierarchy-switch] option[value = child ]').innerHTML
    ).toContain('CHILD');
  });
});
