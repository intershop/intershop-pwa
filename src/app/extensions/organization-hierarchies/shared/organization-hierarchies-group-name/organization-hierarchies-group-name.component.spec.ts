import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, strictEqual, when } from 'ts-mockito';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';
import { OrganizationHierarchiesGroup } from '../../models/organization-hierarchies-group/organization-hierarchies-group.model';

import { OrganizationHierarchiesGroupNameComponent } from './organization-hierarchies-group-name.component';

describe('Organization Hierarchies Group Name Component', () => {
  let component: OrganizationHierarchiesGroupNameComponent;
  let fixture: ComponentFixture<OrganizationHierarchiesGroupNameComponent>;
  let element: HTMLElement;
  let organizationHierarchiesFacade: OrganizationHierarchiesFacade;
  let translateService: TranslateService;

  beforeEach(async () => {
    organizationHierarchiesFacade = mock(OrganizationHierarchiesFacade);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [OrganizationHierarchiesGroupNameComponent],
      providers: [
        { provide: OrganizationHierarchiesFacade, useFactory: () => instance(organizationHierarchiesFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationHierarchiesGroupNameComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    translateService = TestBed.inject(TranslateService);
    translateService.use('en');
    translateService.setTranslation('en', {
      'organization.group.label': 'Group:',
    });
  });

  it('should be created', () => {
    component.buyingContext = 'test-group@test-org';
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show group name when provided with id', () => {
    component.buyingContext = 'test-group@test-org';
    const group: OrganizationHierarchiesGroup = { id: 'test-group', displayName: 'Test Group' };
    when(organizationHierarchiesFacade.getDetailsOfGroup$(strictEqual('test-group'))).thenReturn(of(group));
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`<span>Group:&nbsp;</span><span>Test Group</span>`);
  });

  it('should show group name without label when provided with id', () => {
    component.buyingContext = 'test-group@test-org';
    component.showLabel = false;
    const group: OrganizationHierarchiesGroup = { id: 'test-group', displayName: 'Test Group' };
    when(organizationHierarchiesFacade.getDetailsOfGroup$(strictEqual('test-group'))).thenReturn(of(group));
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`<span>Test Group</span>`);
  });
});
