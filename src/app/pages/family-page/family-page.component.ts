import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './family-page.component.html'
})

export class FamilyPageComponent {
  isListView: Boolean;
  sortBy;
  totalItems:number;
}
