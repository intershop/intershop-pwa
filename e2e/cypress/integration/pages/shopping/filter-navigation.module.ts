export class FilterNavigationModule {
  filter(name: string) {
    const filterGroup = cy.get('div.filter-group').contains(name).parent();
    return {
      filterClick: (value: string) => filterGroup.find(`[data-testing-id=filter-link-${value}]`).click(),
      getFilter: (value: string) => filterGroup.find(`[data-testing-id=filter-link-${value}]`),
    };
  }
}
