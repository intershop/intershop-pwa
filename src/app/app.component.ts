import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'is-root',
  templateUrl: './app.component.html',
})

export class AppComponent {

  // DEBUG: prints the configured routes for routing analysis
  constructor(private router: Router) { console.log('ROUTES: ', this.router.config); }

}
