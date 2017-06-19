import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const mock_categories = [
        { id: 'M', name: 'Memory'},
        { id: 'B', name: 'Brands' },
        { id: '0', name: 'Cameras'},
        { id: 'C', name: 'Computers' },
        { id: 'A', name: 'Home Entertainment' },
        { id: 'B', name: 'Specials' }
    ];

    const categories = {
      "elements": [
          {
              "name": "Cameras & Camcorders",
              "type": "Category",
              "id": "Cameras-Camcorders",
              "description": "The Vectra products and services catalog.",
              "online": "1",
              "hasOnlineSubCategories": true,
              "hasOnlineProducts": true,
              "uri": "PrimeTech-PrimeTechSpecials-Site/b2c-web-shop/categories/Cameras-Camcorders"
          },
          {
              "name": "Computers",
              "type": "Category",
              "id": "Computers",
              "description": "The Computers products and services catalog.",
              "online": "1",
              "hasOnlineSubCategories": true,
              "hasOnlineProducts": true,
              "uri": "PrimeTech-PrimeTechSpecials-Site/b2c-web-shop/categories/Computers"
          },
          {
              "name": "Mobile Computing",
              "type": "Category",
              "id": "Telecommunication",
              "description": "The Mobile Computing products and services catalog.",
              "online": "1",
              "hasOnlineSubCategories": true,
              "hasOnlineProducts": false,
              "uri": "PrimeTech-PrimeTechSpecials-Site/b2c-web-shop/categories/Telecommunication"
          },
          {
              "name": "Specials",
              "type": "Category",
              "id": "Specials",
              "description": "Special products and services.",
              "online": "1",
              "hasOnlineSubCategories": true,
              "hasOnlineProducts": false,
              "uri": "PrimeTech-PrimeTechSpecials-Site/b2c-web-shop/categories/Specials"
          },
          {
              "name": "TV & Home Entertainment",
              "type": "Category",
              "id": "TV-Home-Entertainment",
              "description": "The TV & Home Entertainment products and services catalog.",
              "online": "1",
              "hasOnlineSubCategories": true,
              "hasOnlineProducts": false,
              "uri": "PrimeTech-PrimeTechSpecials-Site/b2c-web-shop/categories/TV-Home-Entertainment"
          }
      ],
      "type": "Categories"
    };
    return {categories};
  }
}