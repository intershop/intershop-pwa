import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CopilotEmbeddedConfig } from '../models/copilot-embedded-config/copilot-embedded-config.model';
import {
  CopilotEmbeddedRequestOptions,
  CopilotEmbeddedResponse,
  CopilotEmbeddedStreamEvent,
  CopilotEmbeddedToolCall,
} from '../models/copilot-embedded/copilot-embedded.model';
import { CopilotEmbeddedService } from '../services/copilot-embedded/copilot-embedded.service';

import { CopilotEmbeddedToolCallFacade } from './copilot-embedded-tool-call.facade';

/**
 * Facade for the Copilot Embedded AI agent, providing components a single injection point for the
 * Flowise chat interaction without depending on the underlying {@link CopilotEmbeddedService}.
 */
@Injectable({ providedIn: 'root' })
export class CopilotEmbeddedFacade {
  constructor(
    private copilotEmbeddedService: CopilotEmbeddedService,
    private copilotEmbeddedToolCallFacade: CopilotEmbeddedToolCallFacade
  ) {}

  configuration$: Observable<CopilotEmbeddedConfig> = this.copilotEmbeddedService.getConfiguration$();

  /**
   * Whether the configured chatflow supports streaming responses.
   */
  isStreamingAvailable$(): Observable<boolean> {
    return this.copilotEmbeddedService.isStreamingAvailable$();
  }

  /**
   * Sends a message to the Copilot Embedded and returns the complete response.
   */
  sendMessage(question: string, options?: CopilotEmbeddedRequestOptions): Observable<CopilotEmbeddedResponse> {
    return this.copilotEmbeddedService.sendMessage(question, options);
  }

  /**
   * Sends a message to the Copilot Embedded and streams the response as it is generated.
   */
  streamMessage(question: string, options?: CopilotEmbeddedRequestOptions): Observable<CopilotEmbeddedStreamEvent> {
    return this.copilotEmbeddedService.streamMessage(question, options);
  }

  /**
   * Executes the action tool calls (basket, compare, navigation, order templates) of a response.
   */
  handleToolCalls(toolCalls: CopilotEmbeddedToolCall[] | undefined): void {
    this.copilotEmbeddedToolCallFacade.handleToolCalls(toolCalls);
  }
}
