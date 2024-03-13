import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { TreeComponent } from 'ish-shared/components/common/tree/tree.component';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

import { HierarchiesPageComponent } from './hierarchies-page.component';

describe('Hierarchies Page Component', () => {
  let component: HierarchiesPageComponent;
  let fixture: ComponentFixture<HierarchiesPageComponent>;
  let element: HTMLElement;
  let organizationHierarchiesFacade: OrganizationHierarchiesFacade;

  const rootGroup = {
    id: 'root',
    name: 'ROOT',
    organization: 'acme.org',
  } as OrganizationGroup;
  const childGroup = {
    id: 'child',
    name: 'Child',
    organization: 'acme.org',
  } as OrganizationGroup;
  const groupTree = [rootGroup, childGroup] as OrganizationGroup[];

  beforeEach(async () => {
    organizationHierarchiesFacade = mock(OrganizationHierarchiesFacade);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [HierarchiesPageComponent, MockComponent(ErrorMessageComponent), MockComponent(TreeComponent)],
      providers: [
        { provide: OrganizationHierarchiesFacade, useFactory: () => instance(organizationHierarchiesFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchiesPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(organizationHierarchiesFacade.groupsOfCurrentUser$()).thenReturn(of(groupTree));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
