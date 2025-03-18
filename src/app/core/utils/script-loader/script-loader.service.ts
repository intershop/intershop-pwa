import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, Observer } from 'rxjs';

interface ScriptType {
  src: string;
  loaded: boolean;
}

interface ScriptLoaderOption {
  /**
   * optionally set a type if it is not a classic Javascript file, e.g. 'module'
   */
  type?: string;
  /**
   * integrity hash and crossOrigin to 'anonymous' (parameter 'crossorigin' ignored in that case)
   */
  integrity?: string;
  /**
   * optional value for crossOrigin attribute in script tag
   */
  crossorigin?: string;
}

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {
  private registeredScripts: ScriptType[] = [];
  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) {
    // Get an instance of Renderer2
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  /**
   * load a script, if it has not already been loaded
   *
   * @param url   script url, e.g. https://pptest.payengine.de/bridge/1.0/payengine.min.js
   * @param options  a set of optional parameters to configure script handling optionally set a type if it is not a classic Javascript file, e.g. 'module'
   * @returns Observable<ScriptType>
   */

  load(url: string, options?: ScriptLoaderOption): Observable<ScriptType> {
    return new Observable<ScriptType>((observer: Observer<ScriptType>) => {
      let script = this.registeredScripts.find(s => s.src === url);
      if (!script) {
        script = { src: url, loaded: false };
        this.registeredScripts.push(script);
      }

      // Complete if already loaded
      if (script?.loaded) {
        observer.next(script);
        observer.complete();
      } else {
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

        scriptElement.onload = () => {
          script.loaded = true;
          observer.next(script);
          observer.complete();
        };

        scriptElement.onerror = () => {
          observer.error(`Could not load script ${script.src}`);
        };

        // insert script as html body child
        this.renderer.appendChild(this.document.body, scriptElement);
      }
    });
  }
}
