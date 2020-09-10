import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { Customer } from 'ish-core/models/customer/customer.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getICMBaseURL } from 'ish-core/store/core/configuration';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { NodeHelper } from '../../models/node/node.helper';
import { NodeDocument, NodeListDocument } from '../../models/node/node.interface';
import { NodeMapper } from '../../models/node/node.mapper';
import { Node, NodeTree } from '../../models/node/node.model';

@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesService {
  constructor(private apiService: ApiService, private nodeMapper: NodeMapper, private store: Store) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));
  private icmBaseURL$ = this.store.pipe(select(getICMBaseURL), whenTruthy(), take(1));

  private contentTypeHeader = {
    headers: new HttpHeaders({ ['Accept']: 'application/vnd.api+json', ['content-type']: 'application/vnd.api+json' }),
  };

  getNodes(customer: Customer): Observable<NodeTree> {
    return this.icmBaseURL$.pipe(
      switchMap(icmBaseURL =>
        this.apiService
          .get<NodeListDocument>(`${icmBaseURL}/organizations/${customer.customerNo}/nodes`, this.contentTypeHeader)
          .pipe(
            map(data =>
              NodeHelper.setParent(this.nodeMapper.fromCustomerData(customer), this.nodeMapper.fromDocument(data))
            )
          )
      )
    );
  }

  createNode(parent: Node, child: Node): Observable<NodeTree> {
    return this.currentCustomer$.pipe(
      withLatestFrom(this.icmBaseURL$),
      switchMap(([customer, icmBaseURL]) =>
        this.apiService
          .post<NodeDocument>(
            `${icmBaseURL}/organizations/${customer.customerNo}/nodes`,
            this.nodeMapper.toNodeDocument(child, parent.id === customer.customerNo ? undefined : parent),
            this.contentTypeHeader
          )
          .pipe(
            mapToProperty('data'),
            map(nodeData => this.nodeMapper.fromDataReversed(nodeData))
          )
      )
    );
  }
}
