import { waitLoadingEnd } from '../../framework';

export class FilterNavigationModule {
  filter(name: string) {
    const filterGroup = () => cy.get('div.filter-group').contains(name).parent();
    return {
      filterClick: (value: string) => {
        waitLoadingEnd(1000);
        filterGroup().find(`[data-testing-id=filter-link-${value}]`).click();
        waitLoadingEnd(2000);
      },
      getFilter: (value: string) => filterGroup().find(`[data-testing-id=filter-link-${value}]`),
    };
  }
}
