import { Component } from '@angular/core';

@Component({
  selector: 'is-headernavigation',
  templateUrl: './headerNavigation.component.html'
})

export class HeaderNavigationComponent {
  products: any = [

    {
      name: 'Cameras'
    },
    {
      name: 'Computers'
    },
    {
      name: 'Home Entertainment'
    },
    {
      name: 'Specials'
    }

  ];
}
