import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { getCopilotConfig } from '../store/copilot-config/copilot-config.selectors';
import { CopilotIntegrationService, IntegrationMetadata, ValidationResult } from '../services/copilot-integration.service';

@Injectable({ providedIn: 'root' })
export class CopilotFacade {
  constructor(
    private store: Store,
    private copilotIntegrationService: CopilotIntegrationService
  ) {}

  copilotConfiguration$ = this.store.pipe(select(getCopilotConfig));

  /**
   * Get integration metadata for ADO workflow automation
   */
  getIntegrationMetadata$(context?: { [key: string]: string }): Observable<IntegrationMetadata> {
    return this.copilotIntegrationService.generateIntegrationMetadata(context);
  }

  /**
   * Validate current copilot configuration for integration workflows
   */
  validateConfiguration$(): Observable<ValidationResult> {
    return this.copilotConfiguration$.pipe(
      map(config => config || {}),
      switchMap(config => this.copilotIntegrationService.validateIntegrationConfig(config))
    );
  }

  /**
   * Get comprehensive integration status including configuration and metadata
   */
  getIntegrationStatus$(): Observable<IntegrationStatus> {
    return combineLatest([this.copilotConfiguration$, this.validateConfiguration$()]).pipe(
      switchMap(([config, validation]) =>
        this.getIntegrationMetadata$().pipe(
          map(metadata => ({
            configuration: config,
            validation,
            metadata,
            isReady: validation.isValid && !!config,
          }))
        )
      )
    );
  }
}

/**
 * Combined integration status for ADO workflow monitoring
 */
export interface IntegrationStatus {
  configuration: unknown;
  validation: ValidationResult;
  metadata: IntegrationMetadata;
  isReady: boolean;
}
