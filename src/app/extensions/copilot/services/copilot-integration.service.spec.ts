import { TestBed } from '@angular/core/testing';

import {
  CopilotIntegrationService,
  IntegrationEvent,
  IntegrationMetadata,
  ValidationResult,
} from './copilot-integration.service';

describe('CopilotIntegrationService', () => {
  let service: CopilotIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopilotIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateIntegrationMetadata', () => {
    it('should generate metadata with default values when no context provided', done => {
      service.generateIntegrationMetadata().subscribe(metadata => {
        expect(metadata).toBeDefined();
        expect(metadata.source).toBe('intershop-pwa-copilot');
        expect(metadata.version).toBe('1.0.0');
        expect(metadata.capabilities).toHaveLength(4);
        expect(metadata.capabilities).toContain('chat-assistance');
        expect(metadata.capabilities).toContain('product-search');
        expect(metadata.capabilities).toContain('navigation-help');
        expect(metadata.capabilities).toContain('order-support');
        expect(metadata.integrationId).toMatch(/^copilot-\d+-[a-z0-9]{9}$/);
        expect(metadata.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        expect(metadata.context).toEqual({});
        done();
      });
    });

    it('should include provided context in metadata', done => {
      const context = { userId: 'test-user', sessionId: 'test-session' };

      service.generateIntegrationMetadata(context).subscribe(metadata => {
        expect(metadata.context).toEqual(context);
        done();
      });
    });
  });

  describe('validateIntegrationConfig', () => {
    it('should return valid result for complete configuration', done => {
      const config = {
        apiHost: 'https://api.example.com',
        chatflowid: 'test-flow-id',
        theme: { primaryColor: '#blue' },
        chatflowConfig: { vars: { key: 'value' } },
      };

      service.validateIntegrationConfig(config).subscribe(result => {
        expect(result.isValid).toBeTrue();
        expect(result.errors).toHaveLength(0);
        expect(result.warnings).toHaveLength(0);
        done();
      });
    });

    it('should return invalid result for missing required fields', done => {
      const config = {
        theme: { primaryColor: '#blue' },
      };

      service.validateIntegrationConfig(config).subscribe(result => {
        expect(result.isValid).toBeFalse();
        expect(result.errors).toHaveLength(2);
        expect(result.errors).toContain('Missing required field: apiHost');
        expect(result.errors).toContain('Missing required field: chatflowid');
        done();
      });
    });

    it('should generate warnings for missing optional configuration', done => {
      const config = {
        apiHost: 'https://api.example.com',
        chatflowid: 'test-flow-id',
      };

      service.validateIntegrationConfig(config).subscribe(result => {
        expect(result.isValid).toBeTrue();
        expect(result.warnings).toHaveLength(2);
        expect(result.warnings).toContain('No custom theme configuration provided - using defaults');
        expect(result.warnings).toContain('No chatflow configuration provided - limited functionality available');
        done();
      });
    });
  });

  describe('createIntegrationReport', () => {
    it('should create report with success status for events without errors', done => {
      const events: IntegrationEvent[] = [
        {
          id: 'event-1',
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'Test info event',
          source: 'test',
        },
        {
          id: 'event-2',
          timestamp: new Date().toISOString(),
          level: 'warning',
          message: 'Test warning event',
          source: 'test',
        },
      ];

      service.createIntegrationReport(events).subscribe(report => {
        expect(report.status).toBe('success');
        expect(report.totalEvents).toBe(2);
        expect(report.eventsSummary).toEqual({ info: 1, warning: 1 });
        expect(report.reportId).toMatch(/^copilot-\d+-[a-z0-9]{9}$/);
        expect(report.metadata.integrationVersion).toBe('1.0.0');
        expect(report.metadata.reportFormat).toBe('json');
        done();
      });
    });

    it('should create report with failed status when errors are present', done => {
      const events: IntegrationEvent[] = [
        {
          id: 'event-1',
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Test error event',
          source: 'test',
        },
      ];

      service.createIntegrationReport(events).subscribe(report => {
        expect(report.status).toBe('failed');
        expect(report.totalEvents).toBe(1);
        expect(report.eventsSummary).toEqual({ error: 1 });
        done();
      });
    });

    it('should sort events by timestamp in descending order', done => {
      const now = Date.now();
      const events: IntegrationEvent[] = [
        {
          id: 'event-1',
          timestamp: new Date(now - 1000).toISOString(),
          level: 'info',
          message: 'Older event',
          source: 'test',
        },
        {
          id: 'event-2',
          timestamp: new Date(now).toISOString(),
          level: 'info',
          message: 'Newer event',
          source: 'test',
        },
      ];

      service.createIntegrationReport(events).subscribe(report => {
        expect(report.events).toBeDefined();
        expect(report.events![0].id).toBe('event-2'); // Newer event should be first
        expect(report.events![1].id).toBe('event-1'); // Older event should be second
        done();
      });
    });

    it('should handle empty events array', done => {
      service.createIntegrationReport([]).subscribe(report => {
        expect(report.totalEvents).toBe(0);
        expect(report.eventsSummary).toEqual({});
        expect(report.status).toBe('success');
        done();
      });
    });
  });
});