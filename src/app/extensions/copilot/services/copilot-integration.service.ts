import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Service for handling copilot integration capabilities
 * Supports integration with external systems like Azure DevOps workflows
 */
@Injectable({ providedIn: 'root' })
export class CopilotIntegrationService {
  /**
   * Generate integration metadata for workflow automation
   * This helps with ADO-GitHub integration by providing structured data
   */
  generateIntegrationMetadata(context?: { [key: string]: string }): Observable<IntegrationMetadata> {
    const metadata: IntegrationMetadata = {
      timestamp: new Date().toISOString(),
      integrationId: this.generateIntegrationId(),
      source: 'intershop-pwa-copilot',
      version: '1.0.0',
      context: context || {},
      capabilities: [
        'chat-assistance',
        'product-search',
        'navigation-help',
        'order-support',
      ],
    };

    return of(metadata);
  }

  /**
   * Validate integration configuration for automated workflows
   */
  validateIntegrationConfig(config: { [key: string]: unknown }): Observable<ValidationResult> {
    const requiredFields = ['apiHost', 'chatflowid'];
    const missingFields = requiredFields.filter(field => !config[field]);

    const result: ValidationResult = {
      isValid: missingFields.length === 0,
      errors: missingFields.map(field => `Missing required field: ${field}`),
      warnings: this.generateConfigWarnings(config),
    };

    return of(result);
  }

  /**
   * Create integration report for ADO workflow tracking
   */
  createIntegrationReport(events: IntegrationEvent[]): Observable<IntegrationReport> {
    const report: IntegrationReport = {
      reportId: this.generateIntegrationId(),
      generatedAt: new Date().toISOString(),
      totalEvents: events.length,
      eventsSummary: this.summarizeEvents(events),
      status: events.some(e => e.level === 'error') ? 'failed' : 'success',
      metadata: {
        integrationVersion: '1.0.0',
        reportFormat: 'json',
      },
    };

    return of(report).pipe(
      map(r => ({
        ...r,
        events: events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      }))
    );
  }

  private generateIntegrationId(): string {
    return `copilot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateConfigWarnings(config: { [key: string]: unknown }): string[] {
    const warnings: string[] = [];

    if (!config.theme) {
      warnings.push('No custom theme configuration provided - using defaults');
    }

    if (!config.chatflowConfig) {
      warnings.push('No chatflow configuration provided - limited functionality available');
    }

    return warnings;
  }

  private summarizeEvents(events: IntegrationEvent[]): { [key: string]: number } {
    return events.reduce(
      (summary, event) => {
        summary[event.level] = (summary[event.level] || 0) + 1;
        return summary;
      },
      {} as { [key: string]: number }
    );
  }
}

/**
 * Metadata structure for integration workflows
 */
export interface IntegrationMetadata {
  timestamp: string;
  integrationId: string;
  source: string;
  version: string;
  context: { [key: string]: string };
  capabilities: string[];
}

/**
 * Validation result for integration configuration
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Integration event for tracking and reporting
 */
export interface IntegrationEvent {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
  metadata?: { [key: string]: unknown };
}

/**
 * Integration report structure
 */
export interface IntegrationReport {
  reportId: string;
  generatedAt: string;
  totalEvents: number;
  eventsSummary: { [key: string]: number };
  status: 'success' | 'failed';
  events?: IntegrationEvent[];
  metadata: { [key: string]: unknown };
}