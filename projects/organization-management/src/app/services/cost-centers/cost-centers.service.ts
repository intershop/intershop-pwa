import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, forkJoin, throwError } from 'rxjs';
import { concatMap, map, switchMap, take } from 'rxjs/operators';

import { CostCenterData } from 'ish-core/models/cost-center/cost-center.interface';
import { CostCenterMapper } from 'ish-core/models/cost-center/cost-center.mapper';
import { CostCenter, CostCenterBase, CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { whenTruthy } from 'ish-core/utils/operators';
import { encodeResourceID } from 'ish-core/utils/url-resource-ids';

@Injectable({ providedIn: 'root' })
export class CostCentersService {
  constructor(private apiService: ApiService, private store: Store) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));

  /**
   * Get all cost centers of a customer. The current user is expected to have permission APP_B2B_VIEW_COSTCENTER.
   *
   * @returns               All cost centers of the customer.
   */
  getCostCenters(): Observable<CostCenter[]> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService.get(`customers/${customer.customerNo}/costcenters`).pipe(
          this.apiService.resolveLinks<CostCenterData>(),
          map(ccData => ccData.map(CostCenterMapper.fromData))
        )
      )
    );
  }

  /**
   * Get a cost center of a customer. The current user is expected to have permission APP_B2B_VIEW_COSTCENTER.
   *
   * @param   costCenterId  The costCenterId of the cost center.
   * @returns               The requested cost center of the customer.
   */
  getCostCenter(costCenterId: string): Observable<CostCenter> {
    if (!costCenterId) {
      return throwError(() => new Error('getCostCenter() called without required costCenterId'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .get<CostCenterData>(`customers/${customer.customerNo}/costcenters/${costCenterId}`)
          .pipe(map(CostCenterMapper.fromData))
      )
    );
  }

  /**
   * Creates a cost center of a customer. The current user is expected to have permission APP_B2B_MANAGE_COSTCENTER.
   *
   * @param   costCenter  The costCenter for the cost center creation.
   * @returns             The new cost center.
   */
  addCostCenter(costCenter: CostCenterBase): Observable<CostCenter> {
    if (!costCenter) {
      return throwError(() => new Error('addCostCenter() called without required costCenter'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post<CostCenterData>(`customers/${customer.customerNo}/costcenters`, costCenter)
          .pipe(concatMap(() => this.getCostCenter(costCenter.costCenterId)))
      )
    );
  }

  /**
   * Updates a cost center of a customer. The current user is expected to have permission APP_B2B_MANAGE_COSTCENTER.
   *
   * @param   costCenter  The costCenter for the cost center update.
   * @returns             The updated cost center.
   */
  updateCostCenter(costCenter: CostCenterBase): Observable<CostCenter> {
    if (!costCenter) {
      return throwError(() => new Error('updateCostCenter() called without required costCenter'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .patch<CostCenterData>(`customers/${customer.customerNo}/costcenters/${costCenter.id}`, costCenter)
          .pipe(map(CostCenterMapper.fromData))
      )
    );
  }

  /**
   * Deletes a cost center of a customer. The current user is expected to have permission APP_B2B_MANAGE_COSTCENTER.
   *
   * @param     id  The id of the costcenter that is to be deleted.
   */
  deleteCostCenter(id: string) {
    if (!id) {
      return throwError(() => new Error('deleteCostCenter() called without required id'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer => this.apiService.delete(`customers/${customer.customerNo}/costcenters/${id}`))
    );
  }

  /**
   * Adds buyers with their budgets to the cost center. The current user is expected to have permission APP_B2B_MANAGE_COSTCENTER.
   *
   * @param     costCenterId  The id of the costcenter.
   * @param     buyers        An array of buyers and budgets.
   * @returns                 The changed cost center.
   */
  addCostCenterBuyers(costCenterId: string, buyers: CostCenterBuyer[]): Observable<CostCenter> {
    if (!costCenterId) {
      return throwError(() => new Error('addCostCenterBuyers() called without required costCenterId'));
    }
    if (!buyers?.length) {
      return throwError(() => new Error('addCostCenterBuyers() called without required buyers'));
    }

    return this.currentCustomer$.pipe(
      concatMap(customer =>
        forkJoin(
          buyers.map(buyer =>
            this.apiService.post(`customers/${customer.customerNo}/costcenters/${costCenterId}/buyers`, buyer)
          )
        ).pipe(concatMap(() => this.getCostCenter(costCenterId)))
      )
    );
  }

  /**
   * Updates a cost center buyer budget. The current user is expected to have permission APP_B2B_MANAGE_COSTCENTER.
   *
   * @param     costCenterId  The id of the costcenter.
   * @param     buyer         The changed buyer budget of the costcenter.
   * @returns                 The updated cost center.
   */
  updateCostCenterBuyer(costCenterId: string, buyer: CostCenterBuyer): Observable<CostCenter> {
    if (!costCenterId) {
      return throwError(() => new Error('updateCostCenterBuyer() called without required costCenterId'));
    }
    if (!buyer) {
      return throwError(() => new Error('updateCostCenterBuyer() called without required buyer'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .patch(
            `customers/${customer.customerNo}/costcenters/${costCenterId}/buyers/${encodeResourceID(buyer.login)}`,
            buyer
          )
          .pipe(concatMap(() => this.getCostCenter(costCenterId)))
      )
    );
  }

  /**
   * Un-assigns a buyer from a cost center. The current user is expected to have permission APP_B2B_MANAGE_COSTCENTER.
   *
   * @param     costCenterId  The id of the costcenter.
   * @param     login         The login of the buyer.
   * @returns                 The changed cost center.
   */
  deleteCostCenterBuyer(costCenterId: string, login: string): Observable<CostCenter> {
    if (!costCenterId) {
      return throwError(() => new Error('deleteCostCenterBuyer() called without required costCenterId'));
    }
    if (!login) {
      return throwError(() => new Error('deleteCostCenterBuyer() called without required login'));
    }

    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .delete(`customers/${customer.customerNo}/costcenters/${costCenterId}/buyers/${encodeResourceID(login)}`)
          .pipe(concatMap(() => this.getCostCenter(costCenterId)))
      )
    );
  }
}
