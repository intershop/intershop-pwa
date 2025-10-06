/**
 * Azure DevOps integration models for copilot workflow automation
 */

export interface AdoWorkItemMetadata {
  workItemId?: number;
  workItemType: 'Task' | 'Issue' | 'Bug' | 'Feature';
  areaPath: string;
  iterationPath?: string;
  state: 'New' | 'Active' | 'Resolved' | 'Closed';
  assignedTo?: string;
  tags?: string[];
}

export interface AdoIntegrationEvent {
  eventType: 'workitem_created' | 'workitem_updated' | 'pr_created' | 'pr_updated' | 'issue_created';
  timestamp: string;
  sourceSystem: 'github' | 'azure-devops';
  payload: AdoWorkItemMetadata;
  metadata?: {
    repositoryName?: string;
    branchName?: string;
    pullRequestId?: number;
    issueNumber?: number;
    copilotContext?: CopilotWorkflowContext;
  };
}

export interface CopilotWorkflowContext {
  isAiAssisted: boolean;
  analysisRequested: boolean;
  solutionProposed: boolean;
  testingStrategy: 'unit' | 'integration' | 'e2e' | 'manual' | 'automated';
  architecturalImpact: 'low' | 'medium' | 'high';
  featureToggles?: string[];
  affectedComponents?: string[];
}

export interface AdoSyncConfiguration {
  organization: string;
  project: string;
  areaPath: string;
  iterationPath?: string;
  defaultWorkItemType: AdoWorkItemMetadata['workItemType'];
  autoCreateWorkItems: boolean;
  syncLabels: boolean;
  copilotIntegration: {
    enabled: boolean;
    autoAnalysis: boolean;
    generateMetadata: boolean;
  };
}

/**
 * ADO integration status for monitoring workflow health
 */
export interface AdoIntegrationStatus {
  isConnected: boolean;
  lastSyncTimestamp?: string;
  syncedWorkItems: number;
  failedSyncs: number;
  configuration: AdoSyncConfiguration;
  errors?: AdoIntegrationError[];
}

export interface AdoIntegrationError {
  errorCode: string;
  message: string;
  timestamp: string;
  workItemId?: number;
  context?: { [key: string]: unknown };
}