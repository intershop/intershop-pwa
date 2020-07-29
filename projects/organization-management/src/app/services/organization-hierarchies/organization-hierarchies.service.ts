import { Injectable } from '@angular/core';

import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NodeTree } from '../../models/node/node.model';
import { NodeMapper } from '../../models/node/node.mapper';
import { NodeDocument } from '../../models/node/node.interface';
import { HttpHeaders } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesService {
  constructor(private apiService: ApiService, private nodeMapper: NodeMapper) { }
  private contentTypeHeader = { headers: new HttpHeaders({ ["Accept"]: "application/vnd.api+json" }) } as AvailableOptions;

  getNodes(organizationId: string): Observable<NodeTree> {
    return this.apiService
      .get<NodeDocument>(`http://localhost:8080/organizations/${organizationId}/nodes`, this.contentTypeHeader)
      .pipe(map(data => this.nodeMapper.fromDocument(data)))
  }

}
