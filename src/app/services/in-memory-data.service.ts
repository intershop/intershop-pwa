import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const categories = [
        { id: 'M', name: 'Memory'},
        { id: 'B', name: 'Brands' },
        { id: '0', name: 'Cameras'},
        { id: 'C', name: 'Computers' },
        { id: 'A', name: 'Home Entertainment' },
        { id: 'B', name: 'Specials' }
    ];
    return {categories};
  }
}