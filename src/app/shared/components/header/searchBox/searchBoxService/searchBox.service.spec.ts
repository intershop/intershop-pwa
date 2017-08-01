// import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
// import { Subject } from 'rxjs/Subject';

// import { SearchBoxService } from './searchBox.service';
// import { SuggestedElement } from './searchBox.model';
// import { Observable } from 'rxjs/Observable';


// describe('Search Box Service', () => {

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [SearchBoxService]
//         });

//     });

//   /*  it('searchresults should not be undefined', fakeAsync(inject([SearchBoxService], (searchBoxService: SearchBoxService) => {
//         let searchResults;
//         let searchTerm$ = new Subject<string>();
//         searchTerm$.next('n');

//         SearchBoxService.search(searchTerm$).subscribe((results: SuggestedElement[]) => {
//             searchResults = results.length > 0 ? results : [];
//         });

//         tick(500);
//         expect(searchResults).not.toBeUndefined();
//     })));*/


// /*    it('searchresults should not be undefined', fakeAsync( () => {
//         let searchResults;
//         let searchTerm$ = new Subject<string>();
//         searchTerm$.next('n');

//         SearchBoxService.search(searchTerm$).subscribe((results: SuggestedElement[]) => {
//             searchResults = results.length > 0 ? results : [];
//         });

//         tick(500);
//         expect(searchResults).not.toBeUndefined();
//     }));*/

// });
