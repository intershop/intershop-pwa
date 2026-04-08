import { Injectable } from '@angular/core';

interface UploadItem {
  data?: string;
  name?: string;
  mime?: string;
  type?: string;
}

/**
 * Service that intercepts outgoing Flowise prediction requests and routes
 * image uploads to an external image search tool instead of the LLM.
 *
 * When enabled, it:
 * - Removes images from body.uploads so the LLM never processes them
 * - Sets allowImageUploads: false in overrideConfig as an additional safeguard
 * - Appends [image-search] to the question for Flowise flow routing
 * - Moves image data (base64, name, mime, type) into overrideConfig.vars.uploads
 */
@Injectable({ providedIn: 'root' })
export class ImageRoutingBridgeService {
  private readonly predictionPath = '/api/v1/prediction';
  private originalFetch!: typeof window.fetch;

  enable(): void {
    this.originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => this.interceptFetch(input, init);
  }

  private async interceptFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;

    if (url?.includes(this.predictionPath) && init?.body && typeof init.body === 'string') {
      const transformedInit = this.transformRequest(init);
      return this.originalFetch(input, transformedInit ?? init);
    }

    return this.originalFetch(input, init);
  }

  private transformRequest(init: RequestInit): RequestInit | undefined {
    try {
      const body = JSON.parse(init.body as string);
      const uploads: UploadItem[] = Array.isArray(body.uploads) ? body.uploads : [];
      const imageUploads = uploads.filter(u => u.mime?.startsWith('image/'));

      if (!imageUploads.length) {
        return undefined;
      }

      const nonImageUploads = uploads.filter(u => !u.mime?.startsWith('image/'));
      const transformedBody = this.buildTransformedBody(body, imageUploads, nonImageUploads);
      return { ...init, body: JSON.stringify(transformedBody) };
    } catch {
      return undefined;
    }
  }

  private buildTransformedBody(
    body: Record<string, unknown>,
    imageUploads: UploadItem[],
    nonImageUploads: UploadItem[]
  ): Record<string, unknown> {
    const overrideConfig = body.overrideConfig as Record<string, unknown>;
    return {
      ...body,
      uploads: nonImageUploads.length > 0 ? nonImageUploads : undefined,
      question: `${body.question ?? ''} [image-search]`.trim(),
      overrideConfig: {
        ...overrideConfig,
        allowImageUploads: false,
        vars: {
          ...((overrideConfig?.vars as Record<string, unknown>) ?? {}),
          uploads: imageUploads.map(({ data, name, mime, type }) => ({ data, name, mime, type })),
        },
      },
    };
  }
}