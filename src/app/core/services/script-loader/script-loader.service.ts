import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

interface ScriptType {
  name: string;
  src: string;
  loaded: boolean;
}

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {
  // registered scripts
  private scripts: ScriptType[] = [
    {
      name: 'concardis-payengine',
      src: 'https://pptest.payengine.de/bridge/1.0/payengine.min.js',
      loaded: false,
    },
  ];

  /**
   * load a script, if it has not already been loaded
   */
  load(name: string): Observable<ScriptType> {
    return new Observable<ScriptType>((observer: Observer<ScriptType>) => {
      const script = this.scripts.find(s => s.name === name);

      // Complete if already loaded
      if (script && script.loaded) {
        observer.next(script);
        observer.complete();
      } else {
        // Load the script
        const scriptElement = document.createElement('script');
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
        document.getElementsByTagName('body')[0].appendChild(scriptElement);
      }
    });
  }
}
