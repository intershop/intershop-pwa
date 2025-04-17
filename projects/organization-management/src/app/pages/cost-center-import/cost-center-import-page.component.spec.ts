import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

import { CostCenterImportPageComponent } from './cost-center-import-page.component';

describe('Cost Center Import Page Component', () => {
  let component: CostCenterImportPageComponent;
  let fixture: ComponentFixture<CostCenterImportPageComponent>;

  const cdrMock = {
    detectChanges: jest.fn(),
  };

  const organizationManagementFacadeMock = {
    addCostCenterFromCSV: jest.fn(() => of(true)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CostCenterImportPageComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ChangeDetectorRef, useValue: cdrMock },
        { provide: OrganizationManagementFacade, useValue: organizationManagementFacadeMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterImportPageComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(CostCenterImportPageComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(fixture.nativeElement).toBeTruthy();
  });
});
