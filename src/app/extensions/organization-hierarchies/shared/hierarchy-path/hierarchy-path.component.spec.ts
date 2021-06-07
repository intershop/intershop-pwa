import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { Order } from 'ish-core/models/order/order.model';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';

import { HierarchyPathComponent } from './hierarchy-path.component';

describe('Hierarchy Path Component', () => {
  let component: HierarchyPathComponent;
  let fixture: ComponentFixture<HierarchyPathComponent>;
  let element: HTMLElement;
  let organizationHierarchiesFacade: OrganizationHierarchiesFacade;
  const order = { id: '1', documentNo: '00000001', lineItems: [] } as Order;

  beforeEach(async () => {
    organizationHierarchiesFacade = mock(OrganizationHierarchiesFacade);

    await TestBed.configureTestingModule({
      declarations: [HierarchyPathComponent, MockComponent(FaIconComponent), MockComponent(NgbPopover)],
      providers: [
        { provide: OrganizationHierarchiesFacade, useFactory: () => instance(organizationHierarchiesFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyPathComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.object = order;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
