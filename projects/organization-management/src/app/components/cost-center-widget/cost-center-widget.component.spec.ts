import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { CostCenterBudgetComponent } from '../cost-center-budget/cost-center-budget.component';

import { CostCenterWidgetComponent } from './cost-center-widget.component';

describe('Cost Center Widget Component', () => {
  let component: CostCenterWidgetComponent;
  let fixture: ComponentFixture<CostCenterWidgetComponent>;
  let element: HTMLElement;
  let organizationManagementFacade: OrganizationManagementFacade;

  beforeEach(async () => {
    organizationManagementFacade = mock(OrganizationManagementFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        CostCenterWidgetComponent,
        MockComponent(CostCenterBudgetComponent),
        MockComponent(InfoBoxComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [{ provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) }],
    }).compileComponents();

    when(organizationManagementFacade.costCentersOfCurrentUser$()).thenReturn(
      of([{ costCenterId: '100333', name: 'Marketing' } as CostCenter])
    );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterWidgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if cost centers are loading', () => {
    when(organizationManagementFacade.costCentersLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should render cost center list after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('.loading-container').textContent).toMatchInlineSnapshot(
      `" 100333 Marketing  account.costcenter.widget.manage.link "`
    );
  });
});
