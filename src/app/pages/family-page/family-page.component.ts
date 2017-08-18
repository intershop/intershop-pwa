import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './family-page.component.html'
})

export class FamilyPageComponent {
  isListView: Boolean;
  sortBy;
  totalItems: number;
}
