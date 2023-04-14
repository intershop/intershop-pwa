import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable, Observer } from 'rxjs';

interface ScriptType {
  src: string;
  loaded: boolean;
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
   * @param url  script url, e.g. https://pptest.payengine.de/bridge/1.0/payengine.min.js
   */

  load(url: string): Observable<ScriptType> {
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
        scriptElement.type = 'text/javascript';
        scriptElement.src = script.src;
        scriptElement.async = true;

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
