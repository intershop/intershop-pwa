import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'is-category-page',
  templateUrl: './category-page.component.html'
})

export class CategoryPageComponent implements OnInit {

  families = [
    { 'name': 'Camcorders', 'id': 832 },
    { 'name': 'Digital Cameras', 'id': 833 },
    { 'name': 'Webcams', 'id': 834 }
  ];

  ngOnInit() {

  }

}
