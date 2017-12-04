import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  // DEBUG: prints the configured routes for routing analysis
  constructor(private router: Router) { console.log('ROUTES: ', this.router.config); }

}
