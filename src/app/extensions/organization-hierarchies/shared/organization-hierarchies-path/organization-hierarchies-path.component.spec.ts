import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { Order } from 'ish-core/models/order/order.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';

import { OrganizationHierarchiesPathComponent } from './organization-hierarchies-path.component';

describe('Organization Hierarchies Path Component', () => {
  let component: OrganizationHierarchiesPathComponent;
  let fixture: ComponentFixture<OrganizationHierarchiesPathComponent>;
  let element: HTMLElement;
  let organizationHierarchiesFacade: OrganizationHierarchiesFacade;
  const order = { id: '1', documentNo: '00000001', lineItems: [], buyingContext: 'klaus@klausInc' } as Order;

  beforeEach(async () => {
    organizationHierarchiesFacade = mock(OrganizationHierarchiesFacade);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(LoadingComponent),
        MockDirective(NgbCollapse),
        OrganizationHierarchiesPathComponent,
      ],
      providers: [
        { provide: OrganizationHierarchiesFacade, useFactory: () => instance(organizationHierarchiesFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationHierarchiesPathComponent);
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
