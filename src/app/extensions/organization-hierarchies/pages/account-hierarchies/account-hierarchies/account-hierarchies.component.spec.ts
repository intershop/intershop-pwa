import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';
import { TreeComponent } from 'ish-shared/components/common/tree/tree.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { OrganizationHierarchiesFacade } from '../../../facades/organization-hierarchies.facade';
import { OrganizationHierarchiesGroup } from '../../../models/organization-hierarchies-group/organization-hierarchies-group.model';
import { OrganizationHierarchiesCreateGroupComponent } from '../../../shared/component/organization-hierarchies-create-group/organization-hierarchies-create-group.component';

import { AccountHierarchiesComponent } from './account-hierarchies.component';

describe('Account Hierarchies Component', () => {
  let component: AccountHierarchiesComponent;
  let fixture: ComponentFixture<AccountHierarchiesComponent>;
  let element: HTMLElement;
  let organizationHierarchiesFacade: OrganizationHierarchiesFacade;

  const rootGroup = {
    id: 'root',
    displayName: 'ROOT',
    organization: 'acme.org',
  } as OrganizationHierarchiesGroup;
  const childGroup = {
    id: 'child',
    displayName: 'CHILD',
    organization: 'acme.org',
  } as OrganizationHierarchiesGroup;
  const groupTree = [rootGroup, childGroup] as OrganizationHierarchiesGroup[];

  beforeEach(async () => {
    organizationHierarchiesFacade = mock(OrganizationHierarchiesFacade);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, TranslateModule.forRoot()],
      declarations: [
        AccountHierarchiesComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(ModalDialogComponent),
        MockComponent(OrganizationHierarchiesCreateGroupComponent),
        MockComponent(TreeComponent),
      ],
      providers: [
        { provide: OrganizationHierarchiesFacade, useFactory: () => instance(organizationHierarchiesFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountHierarchiesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(organizationHierarchiesFacade.groups$).thenReturn(of(groupTree));
    when(organizationHierarchiesFacade.getRootGroup$).thenReturn(of(rootGroup));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
  it('should include the delete notification modal dialog', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-modal-dialog')).toBeTruthy();
  });

  it('should trigger modal if click on add button', () => {
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        [
          "ish-error-message",
          "formly-form",
          "formly-field",
          "fa-icon",
          "fa-icon",
          "ish-modal-dialog",
          "ish-tree",
        ]
      `);
    (element.querySelector('[data-testing-id="add-new-group"') as HTMLLinkElement).click();
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        [
          "ish-error-message",
          "formly-form",
          "formly-field",
          "formly-group",
          "formly-field",
          "ish-select-test-field",
          "fa-icon",
          "fa-icon",
          "ish-modal-dialog",
          "ish-organization-hierarchies-create-group",
          "ish-tree",
        ]
      `);
  });
  it('should dispatch action if organization hierarchies group will created', () => {
    const newGroup = {
      id: 'newLeaf',
      displayName: 'NEW_LEAF',
      organization: 'acme.org',
    } as OrganizationHierarchiesGroup;

    (element.querySelector('[data-testing-id="add-new-group"') as HTMLLinkElement).click();
    fixture.detectChanges();
    const createGroupComponent = fixture.debugElement.query(By.css('ish-organization-hierarchies-create-group'));
    createGroupComponent.triggerEventHandler('save', { parentGroupId: childGroup.id, child: newGroup });
    verify(organizationHierarchiesFacade.createAndAddGroup(childGroup.id, newGroup)).once();
  });
});
