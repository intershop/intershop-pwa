import { Component } from '@angular/core';
import { PopoverConfig } from 'ngx-bootstrap/popover';
export function getPopoverConfig(): PopoverConfig {
  return Object.assign(new PopoverConfig(), { placement: 'top', triggers: 'hover', container: 'body' });
}
@Component({
  selector: 'is-root',
  templateUrl: './app.component.html',
  providers: [
    { provide: PopoverConfig, useFactory: getPopoverConfig }
  ]
})
export class AppComponent {
  title = 'app';

  /*constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }*/

}