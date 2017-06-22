import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-family-page',
  templateUrl: './family-page.component.html',
  styleUrls: ['./family-page.component.css']
})
export class FamilyPageComponent implements OnInit {
  
  products = ['product1','product2','product3'];
  
  constructor() { }

  ngOnInit() {
  }

}
