import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductAdvisorConfig } from '../models/product-advisor-config/product-advisor-config.model';
import {
  ProductAdvisorRequestOptions,
  ProductAdvisorResponse,
  ProductAdvisorStreamEvent,
  ProductAdvisorToolCall,
} from '../models/product-advisor/product-advisor.model';
import { ProductAdvisorService } from '../services/product-advisor/product-advisor.service';

import { ProductAdvisorToolCallFacade } from './product-advisor-tool-call.facade';

/**
 * Facade for the Product Advisor AI agent, providing components a single injection point for the
 * Flowise chat interaction without depending on the underlying {@link ProductAdvisorService}.
 */
@Injectable({ providedIn: 'root' })
export class ProductAdvisorFacade {
  constructor(
    private productAdvisorService: ProductAdvisorService,
    private productAdvisorToolCallFacade: ProductAdvisorToolCallFacade
  ) {}

  configuration$: Observable<ProductAdvisorConfig> = this.productAdvisorService.getConfiguration$();

  /**
   * Whether the configured chatflow supports streaming responses.
   */
  isStreamingAvailable$(): Observable<boolean> {
    return this.productAdvisorService.isStreamingAvailable$();
  }

  /**
   * Sends a message to the Product Advisor and returns the complete response.
   */
  sendMessage(question: string, options?: ProductAdvisorRequestOptions): Observable<ProductAdvisorResponse> {
    return this.productAdvisorService.sendMessage(question, options);
  }

  /**
   * Sends a message to the Product Advisor and streams the response as it is generated.
   */
  streamMessage(question: string, options?: ProductAdvisorRequestOptions): Observable<ProductAdvisorStreamEvent> {
    return this.productAdvisorService.streamMessage(question, options);
  }

  /**
   * Executes the action tool calls (basket, compare, navigation, order templates) of a response.
   */
  handleToolCalls(toolCalls: ProductAdvisorToolCall[] | undefined): void {
    this.productAdvisorToolCallFacade.handleToolCalls(toolCalls);
  }
}
