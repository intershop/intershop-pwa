import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { ApiService } from 'ish-core/services/api/api.service';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';

import { NodeDocument, NodeListDocument } from '../../models/node/node.interface';
import { NodeMapper } from '../../models/node/node.mapper';
import { Node, NodeTree } from '../../models/node/node.model';

@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesService {
  constructor(private apiService: ApiService, private nodeMapper: NodeMapper, private store: Store) {}

  private currentCustomer$ = this.store.pipe(select(getLoggedInCustomer), whenTruthy(), take(1));

  private contentTypeHeader = {
    headers: new HttpHeaders({ ['Accept']: 'application/vnd.api+json', ['content-type']: 'application/vnd.api+json' }),
  };

  getNodes(organizationId: string): Observable<NodeTree> {
    return this.apiService
      .get<NodeListDocument>(`http://localhost:8080/organizations/${organizationId}/nodes`, this.contentTypeHeader)
      .pipe(map(data => this.nodeMapper.fromDocument(data)));
  }

  createNode(parent: Node, child: Node): Observable<NodeTree> {
    return this.currentCustomer$.pipe(
      switchMap(customer =>
        this.apiService
          .post<NodeDocument>(
            `http://localhost:8080/organizations/${customer.customerNo}/nodes`,
            {
              data: {
                type: 'node',
                id: child.id,
                attributes: {
                  name: child.name,
                  description: child.description,
                },
                relationships: {
                  parentNode: {
                    data: {
                      id: parent.id,
                    },
                  },
                },
              },
            },
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
