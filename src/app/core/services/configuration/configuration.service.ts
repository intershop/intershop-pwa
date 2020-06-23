import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ServerConfigMapper } from 'ish-core/models/server-config/server-config.mapper';
import { ServerConfig } from 'ish-core/models/server-config/server-config.model';
import { ApiService } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  constructor(private apiService: ApiService) {}

  private configHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.configuration.v1+json',
  });

  /**
   * Gets the ICM configuration parameters.
   * @returns           The configuration object.
   */
  getServerConfiguration(): Observable<ServerConfig> {
    return this.apiService
      .get(`configurations`, {
        headers: this.configHeaders,
      })
      .pipe(map(ServerConfigMapper.fromData));
  }
}
