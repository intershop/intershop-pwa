import { Component } from '@angular/core';
import { PopoverConfig } from 'ngx-bootstrap/popover';
import { LocalizeRouterService } from './services/routes-parser-locale-currency/localize-router.service';

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

  // TODO: is this the right place to handle the global application translation?
  constructor(private localize: LocalizeRouterService) {
    console.log('ROUTES', this.localize.parser.routes);
  }
}
