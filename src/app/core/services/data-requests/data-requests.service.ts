import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';

import { DataRequestData } from 'ish-core/models/data-request/data-request.interface';
import { DataRequestMapper } from 'ish-core/models/data-request/data-request.mapper';
import { DataRequest, DataRequestConfirmation } from 'ish-core/models/data-request/data-request.model';
import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class DataRequestsService {
  constructor(private apiService: ApiService) {}

  /**
   * Confirmation of a GDPR data request with corresponding request id and hash.
   *
   * @param data  The DataRequest model includes request id and hash.
   * @returns The enriched DataRequest model includes additional response status and code of the request.
   */
  confirmGDPRDataRequest(data: DataRequest): Observable<DataRequestConfirmation> {
    if (!data) {
      return throwError(() => new Error('confirmGDPRDataRequest() called without data body'));
    }

    const dataRequestHeaderV1 = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Accept', 'application/vnd.intershop.gdpr.v1+json');

    return this.apiService
      .put<DataRequestData>(
        `gdpr-requests/${data.requestID}/confirmations`,
        { hash: data.hash },
        { headers: dataRequestHeaderV1 }
      )
      .pipe(map(payload => DataRequestMapper.fromData(payload)));
  }
}
