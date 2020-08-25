import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { TreeviewComponent } from 'ngx-treeview';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { Node, NodeTree } from '../../models/node/node.model';

import { HierarchiesPageComponent } from './hierarchies-page.component';

describe('Hierarchies Page Component', () => {
  let component: HierarchiesPageComponent;
  let fixture: ComponentFixture<HierarchiesPageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;
  const rootNode = {
    id: 'root',
    name: 'ROOT',
    organization: 'acme.org',
  } as Node;
  const childNode = {
    id: 'child',
    name: 'Child',
    organization: 'acme.org',
  } as Node;
  const nodeTree = {
    edges: { root: ['child'] },
    nodes: { root: rootNode, child: childNode },
    rootIds: ['root'],
  } as NodeTree;

  beforeEach(async(() => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
    when(organizationManagementFacade.groups$()).thenReturn(of(nodeTree));
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [HierarchiesPageComponent, MockComponent(TreeviewComponent)],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchiesPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
