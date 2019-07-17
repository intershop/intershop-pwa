import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../api/api.service';

@Injectable({ providedIn: 'root' })
export class PersonalizationService {
  constructor(private apiService: ApiService) {}

  getPGID(): Observable<string> {
    return this.apiService.get<{ pgid: string }>('personalization').pipe(map(data => data.pgid));
  }
}
