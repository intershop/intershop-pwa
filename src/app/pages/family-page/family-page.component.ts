import { Component } from '@angular/core';

@Component({
  selector: 'is-family-page',
  templateUrl: './family-page.component.html'
})

export class FamilyPageComponent {
  isListView: Boolean;
  sortBy;
  totalItems: number;
}
