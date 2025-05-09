import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { CostCenterBase, CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

import { CostCentersService } from './cost-centers.service';

describe('Cost Centers Service', () => {
  let apiService: ApiService;
  let costCentersService: CostCentersService;
  const millersEMail = 'pmiller%40test.intershop.de';
  const millersCostcenterEndpoint = `customers/4711/costcenters/123/buyers/${millersEMail}`;

  beforeEach(() => {
    apiService = mock(ApiService);
    when(apiService.get(anything())).thenReturn(of({}));
    when(apiService.post(anything(), anything())).thenReturn(of({}));
    when(apiService.patch(anything(), anything())).thenReturn(of({}));
    when(apiService.delete(anything())).thenReturn(of({}));
    when(apiService.encodeResourceId(anything())).thenCall(id => id);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        provideMockStore({
          selectors: [
            { selector: getLoggedInCustomer, value: { customerNo: '4711', isBusinessCustomer: true } as Customer },
          ],
        }),
      ],
    });
    costCentersService = TestBed.inject(CostCentersService);
  });

  it('should be created', () => {
    expect(costCentersService).toBeTruthy();
  });

  it('should call the getCostCenters of customer API when fetching costCenters', done => {
    when(apiService.get(anything(), anything())).thenReturn(of([]));

    costCentersService.getCostCenters({ offset: 0, limit: 25 }).subscribe(() => {
      verify(apiService.get(anything(), anything())).once();
      const options: AvailableOptions = capture(apiService.get).last()[1];
      expect(options.params?.toString()).toMatchInlineSnapshot(`"offset=0&limit=25&costCenterId=&name="`);
      done();
    });
  });

  it('should call the getCostCenter of customer API when fetching a costCenter', done => {
    when(apiService.get(anything())).thenReturn(of([]));

    costCentersService.getCostCenter('100400').subscribe(() => {
      verify(apiService.get(anything())).once();
      expect(capture(apiService.get).last()).toMatchInlineSnapshot(`
        [
          "customers/4711/costcenters/100400",
        ]
      `);
      done();
    });
  });

  it('should call the addCostCenter of the customer API for creating a new cost center', done => {
    const costCenter = { costCenterId: '123456' } as CostCenterBase;

    costCentersService.addCostCenter(costCenter).subscribe(() => {
      verify(apiService.post(anything(), anything())).once();
      expect(capture(apiService.post).last()[0]).toMatchInlineSnapshot(`"customers/4711/costcenters"`);
      done();
    });
  });

  it('should call the updateCostCenter of the customer API for updating a cost center', done => {
    const costCenter = { id: '987', costCenterId: '123456' } as CostCenterBase;

    costCentersService.updateCostCenter(costCenter).subscribe(() => {
      verify(apiService.patch(anything(), anything())).once();
      expect(capture(apiService.patch).last()[0]).toMatchInlineSnapshot(`"customers/4711/costcenters/987"`);
      done();
    });
  });

  it('should call the deleteCostCenter of the customer API for deleting a cost center', done => {
    const id = '987';

    costCentersService.deleteCostCenter(id).subscribe(() => {
      verify(apiService.delete(anything())).once();
      expect(capture(apiService.delete).last()[0]).toMatchInlineSnapshot(`"customers/4711/costcenters/987"`);
      done();
    });
  });

  it('should call the addCostCenterBuyers of the customer API for adding buyers to a cost center', done => {
    const costCenterBuyers = [
      { login: 'pmiller@test.intershop.de' },
      { login: 'jlink@test.intershop.de' },
    ] as CostCenterBuyer[];

    costCentersService.addCostCenterBuyers('123', costCenterBuyers).subscribe(() => {
      verify(apiService.post(anything(), anything())).twice();
      expect(capture(apiService.post).last()[0]).toMatchInlineSnapshot(`"customers/4711/costcenters/123/buyers"`);
      done();
    });
  });

  it('should call the updateCostCenterBuyer of the customer API for updating a cost center buyer', done => {
    const costCenterBuyer = { login: millersEMail } as CostCenterBuyer;

    costCentersService.updateCostCenterBuyer('123', costCenterBuyer).subscribe(() => {
      verify(apiService.patch(anything(), anything())).once();
      expect(capture(apiService.patch).last()[0]).toMatchInlineSnapshot(`"${millersCostcenterEndpoint}"`);
      done();
    });
  });

  it('should call the deleteCostCenterBuyer of the customer API for deleting a cost center buyer', done => {
    costCentersService.deleteCostCenterBuyer('123', millersEMail).subscribe(() => {
      verify(apiService.delete(anything())).once();
      expect(capture(apiService.delete).last()[0]).toMatchInlineSnapshot(`"${millersCostcenterEndpoint}"`);
      done();
    });
  });
});
