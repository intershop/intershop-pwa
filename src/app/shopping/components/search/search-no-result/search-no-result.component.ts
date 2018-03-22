import { Component, Input } from '@angular/core';

@Component({
  selector: 'ish-search-no-result',
  templateUrl: './search-no-result.component.html'
})

export class SearchNoResultComponent {

  @Input() searchTerm: string;
}
