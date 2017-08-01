import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './familyPage.component.html'
})

export class FamilyPageComponent {
  isListView: Boolean;
  sortBy;
}
