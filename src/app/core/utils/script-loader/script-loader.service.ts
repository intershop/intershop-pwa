import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { Attribute } from 'ish-core/models/attribute/attribute.model';

/**
 * Represents a script that has been loaded or is being loaded.
 */
export interface ScriptType {
  /** The source URL of the script */
  src: string;
  /** Indicates whether the script has successfully loaded */
  loaded: boolean;
}

/**
 * Configuration options for loading a script element.
 */
interface ScriptLoaderOption {
  /**
   * Optionally set a type if it is not a classic Javascript file, e.g. 'module'
   */
  type?: string;
  /**
   * Integrity hash and crossOrigin to 'anonymous' (parameter 'crossorigin' ignored in that case)
   */
  integrity?: string;
  /**
   * Optional value for crossOrigin attribute in script tag
   */
  crossorigin?: string;
  /**
   * Optional script html element (data) attributes, e.g. <script src="..." data-foo="bar">
   */
  attributes?: Attribute<string>[];
}

/**
 * Service for dynamically loading external JavaScript files into the DOM.
 *
 * This service provides a centralized way to load third-party scripts with:
 * - Caching to prevent duplicate script loading
 * - Support for script attributes (type, integrity, crossorigin, custom data attributes)
 * - Observable-based API for tracking load status
 * - Automatic detection of already-loaded scripts in the DOM
 */
@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {
  private renderer: Renderer2;
  /** Cache of successfully loaded scripts */
  private loadedScripts = new Map<string, Observable<ScriptType>>();
  /** Cache of scripts currently being loaded */
  private loadingScripts = new Map<string, Observable<ScriptType>>();

  constructor(private rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) {
    // Get an instance of Renderer2
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  /**
   * Loads an external JavaScript file dynamically into the DOM.
   *
   * This method handles the complete lifecycle of script loading:
   * 1. Checks if the script is already loaded (returns cached observable)
   * 2. Checks if the script is currently loading (returns in-progress observable)
   * 3. Checks if the script already exists in the DOM (marks as loaded immediately)
   * 4. Creates and appends a new script element to the document body
   */
  load(url: string, options?: ScriptLoaderOption): Observable<ScriptType> {
    // Create a cache key that includes options to handle different script configurations
    const cacheKey = this.createCacheKey(url, options);
    // Check if script is already loaded
    if (this.loadedScripts.has(cacheKey)) {
      return this.loadedScripts.get(cacheKey);
    }

    // Check if script is currently loading
    if (this.loadingScripts.has(cacheKey)) {
      return this.loadingScripts.get(cacheKey);
    }

    // Check if script is already in the DOM
    if (this.isScriptAlreadyLoaded(url, options?.attributes?.find(attr => attr.name === 'data-namespace')?.value)) {
      const loadedScript$ = new Observable<ScriptType>(observer => {
        observer.next({ src: url, loaded: true });
        observer.complete();
      }).pipe(shareReplay(1));

      this.loadedScripts.set(cacheKey, loadedScript$);
      return loadedScript$;
    }

    // Create new loading observable
    const loading$ = new Observable<ScriptType>((observer: Observer<ScriptType>) => {
      const script: ScriptType = { src: url, loaded: false };
      // Load the script
      const scriptElement = this.renderer.createElement('script');
      scriptElement.src = url;
      scriptElement.async = true;
      if (options?.type) {
        scriptElement.type = options.type;
      }

      if (options?.crossorigin) {
        scriptElement.crossOrigin = options.crossorigin;
      }

      if (options?.integrity) {
        scriptElement.integrity = options.integrity;
        scriptElement.crossOrigin = 'anonymous'; // required to be 'anonymous' if integrity is given
      }

      if (options?.attributes?.length) {
        for (const attr of options.attributes) {
          this.renderer.setAttribute(scriptElement, attr.name, attr.value);
        }
      }

      scriptElement.onload = () => {
        script.loaded = true;
        // Move from loading to loaded cache
        this.loadingScripts.delete(cacheKey);
        this.loadedScripts.set(cacheKey, loading$);
        observer.next(script);
        observer.complete();
      };

      scriptElement.onerror = () => {
        // Remove from loading cache on error
        this.loadingScripts.delete(cacheKey);
        observer.error(`Could not load script ${script.src}`);
      };

      // insert script as html body child
      this.renderer.appendChild(this.document.body, scriptElement);
    }).pipe(shareReplay(1));

    // Add to loading cache
    this.loadingScripts.set(cacheKey, loading$);
    return loading$;
  }

  private createCacheKey(url: string, options?: ScriptLoaderOption): string {
    // Use data-namespace attribute value as cache key
    const namespaceAttribute = options?.attributes?.find(attr => attr.name === 'data-namespace');
    if (namespaceAttribute) {
      return namespaceAttribute.value;
    }

    return url;
  }

  private isScriptAlreadyLoaded(url: string, namespace?: string): boolean {
    if (namespace) {
      // When namespace is provided, check only for namespace presence in DOM
      // This prevents re-loading scripts with dynamic URLs (like PayPal with changing locale/currency)
      const scripts = this.document.querySelectorAll(`script[data-namespace="${namespace}"]`);
      return scripts.length > 0;
    }
    // For scripts without namespace, check by URL
    const scripts = this.document.querySelectorAll('script[src]');
    return Array.from(scripts).some(script => (script as HTMLScriptElement).src === url);
  }
}
