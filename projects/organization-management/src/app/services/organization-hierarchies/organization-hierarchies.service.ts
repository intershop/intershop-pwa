import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from 'ish-core/services/api/api.service';

import { NodeDocument } from '../../models/node/node.interface';
import { NodeMapper } from '../../models/node/node.mapper';
import { NodeTree } from '../../models/node/node.model';

@Injectable({ providedIn: 'root' })
export class OrganizationHierarchiesService {
  constructor(private apiService: ApiService, private nodeMapper: NodeMapper) {}
  private contentTypeHeader = {
    headers: new HttpHeaders({ ['Accept']: 'application/vnd.api+json' }),
  };

  getNodes(organizationId: string): Observable<NodeTree> {
    return this.apiService
      .get<NodeDocument>(`http://localhost:8080/organizations/${organizationId}/nodes`, this.contentTypeHeader)
      .pipe(map(data => this.nodeMapper.fromDocument(data)));
  }
}
