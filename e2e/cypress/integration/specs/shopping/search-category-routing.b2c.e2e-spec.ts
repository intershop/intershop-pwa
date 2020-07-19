import { at, waitLoadingEnd } from '../../framework';
import { FamilyPage } from '../../pages/shopping/family.page';
import { SearchResultPage } from '../../pages/shopping/search-result.page';

const _ = {
  suggestTerm: '*',
  category: 'Computers.897.897_Microsoft', // /Microsoft-catComputers.897.897_Microsoft?view=grid
  filter: {
    name: 'Brand',
    entryName: 'ManufacturerName_Microsoft',
    results: 8,
  },
};

describe('Searching User', () => {
  before(() => FamilyPage.navigateTo(_.category));

  it('should perform search and land on search result page', () => {
    at(FamilyPage, page => page.header.searchBox.search(_.suggestTerm));
    at(SearchResultPage, () => {
      waitLoadingEnd(1000);
      cy.go('back');
      waitLoadingEnd(1000);
    });
    at(FamilyPage, page => {
      waitLoadingEnd(1000);
      page.filterNavigation
        .filter(_.filter.name)
        .getFilter(_.filter.entryName)
        .should('contain', `(${_.filter.results})`);
    });
  });
});
