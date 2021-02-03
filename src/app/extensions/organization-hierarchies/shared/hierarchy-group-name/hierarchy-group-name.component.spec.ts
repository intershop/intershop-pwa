import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, strictEqual, when } from 'ts-mockito';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import { OrganizationGroup } from '../../models/organization-group/organization-group.model';

import { HierarchyGroupNameComponent } from './hierarchy-group-name.component';

describe('Hierarchy Group Name Component', () => {
  let component: HierarchyGroupNameComponent;
  let fixture: ComponentFixture<HierarchyGroupNameComponent>;
  let element: HTMLElement;
  let organizationHierarchiesFacade: OrganizationHierarchiesFacade;
  let translateService: TranslateService;

  beforeEach(async () => {
    organizationHierarchiesFacade = mock(OrganizationHierarchiesFacade);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [HierarchyGroupNameComponent],
      providers: [
        { provide: OrganizationHierarchiesFacade, useFactory: () => instance(organizationHierarchiesFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyGroupNameComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translateService = TestBed.inject(TranslateService);
    translateService.use('en');
    translateService.setTranslation('en', {
      'organization.group.label': 'Group:',
    });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show group name when provided with id', () => {
    component.buyingGroupId = 'test-group';
    const group: OrganizationGroup = { id: 'test-group', name: 'Test Group' };
    when(organizationHierarchiesFacade.getDetailsOfGroup$(strictEqual('test-group'))).thenReturn(of(group));
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`<span>Group:&nbsp;</span><span>Test Group</span>`);
  });

  it('should show group name without label when provided with id', () => {
    component.buyingGroupId = 'test-group';
    component.showLabel = false;
    const group: OrganizationGroup = { id: 'test-group', name: 'Test Group' };
    when(organizationHierarchiesFacade.getDetailsOfGroup$(strictEqual('test-group'))).thenReturn(of(group));
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`<span>Test Group</span>`);
  });
});
