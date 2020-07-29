import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { TreeviewComponent } from 'ngx-treeview';
import { instance, mock } from 'ts-mockito';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { HierarchiesPageComponent } from './hierarchies-page.component';

describe('Hierarchies Page Component', () => {
  let component: HierarchiesPageComponent;
  let fixture: ComponentFixture<HierarchiesPageComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;

  beforeEach(async(() => {
    organizationManagementFacade = mock(OrganizationManagementFacade);
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
