import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigOption, FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { CostCenterBuyersPageComponent } from './cost-center-buyers-page.component';
import { CostCenterBuyersRepeatFieldComponent } from './cost-center-buyers-repeat-field/cost-center-buyers-repeat-field.component';

describe('Cost Center Buyers Page Component', () => {
  let component: CostCenterBuyersPageComponent;
  let fixture: ComponentFixture<CostCenterBuyersPageComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;
  let organizationManagementFacade: OrganizationManagementFacade;

  const formlyConfig: ConfigOption = {
    types: [
      {
        name: 'repeatCostCenterBuyers',
        component: MockComponent(CostCenterBuyersRepeatFieldComponent),
      },
    ],
  };

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    organizationManagementFacade = mock(OrganizationManagementFacade);

    await TestBed.configureTestingModule({
      imports: [
        FormlyModule.forChild(formlyConfig),
        FormlyTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        CostCenterBuyersPageComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(LoadingComponent),
      ],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: OrganizationManagementFacade, useFactory: () => instance(organizationManagementFacade) },
      ],
    }).compileComponents();

    when(appFacade.currentCurrency$).thenReturn(of('USD'));
    when(organizationManagementFacade.costCenterUnassignedBuyers$()).thenReturn(
      of([{ login: 'bboldner@test.intershop.de' }, { login: 'jlink@test.intershop.de' }])
    );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterBuyersPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the buyers list after creation', () => {
    fixture.detectChanges();

    expect(element.querySelector('formly-form')).toBeTruthy();
    expect(element.querySelector('[data-testing-id=empty-buyer-list]')).toBeFalsy();
  });

  it('should display the empty list message if there are no buyers', () => {
    when(organizationManagementFacade.costCenterUnassignedBuyers$()).thenReturn(of([]));

    fixture.detectChanges();

    expect(element.querySelector('formly-form')).toBeFalsy();
    expect(element.querySelector('[data-testing-id=empty-buyer-list]')).toBeTruthy();
  });

  it('should display a loading overlay if buyers are loading', () => {
    when(organizationManagementFacade.costCentersLoading$).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it('should select/deselect items if the select all link has been clicked', () => {
    fixture.detectChanges();
    expect(component.model.addBuyers.every(buyer => !buyer.selected)).toBeTruthy();
    expect(component.formDisabled).toBeTruthy();

    component.toggleItemSelection();
    expect(component.model.addBuyers.every(buyer => buyer.selected)).toBeTruthy();
    expect(component.formDisabled).toBeFalsy();

    component.toggleItemSelection();
    expect(component.model.addBuyers.every(buyer => !buyer.selected)).toBeTruthy();
    expect(component.formDisabled).toBeTruthy();
  });
});
