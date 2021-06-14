import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { LazyHierarchyGroupNameComponent } from '../../exports/lazy-hierarchy-group-name/lazy-hierarchy-group-name.component';
import { OrganizationHierarchiesFacade } from '../../facades/organization-hierarchies.facade';

import { HierarchyOrderListComponent } from './hierarchy-order-list.component';

describe('Hierarchy Order List Component', () => {
  let component: HierarchyOrderListComponent;
  let fixture: ComponentFixture<HierarchyOrderListComponent>;
  let element: HTMLElement;
  let organizationHierarchiesFacade: OrganizationHierarchiesFacade;
  let accountFacade: AccountFacade;

  beforeEach(async () => {
    organizationHierarchiesFacade = mock(OrganizationHierarchiesFacade);
    accountFacade = mock(AccountFacade);

    await TestBed.configureTestingModule({
      declarations: [
        HierarchyOrderListComponent,
        MockComponent(AddressComponent),
        MockComponent(LazyHierarchyGroupNameComponent),
        MockComponent(LoadingComponent),
        MockDirective(FeatureToggleDirective),
        MockPipe(DatePipe),
        MockPipe(PricePipe),
      ],
      providers: [
        { provide: OrganizationHierarchiesFacade, useFactory: () => instance(organizationHierarchiesFacade) },
        { provide: AccountFacade, useFactory: () => instance(accountFacade) },
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyOrderListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
