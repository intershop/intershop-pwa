export class LineItemDialogPage {
  readonly tag = 'ish-line-item-edit-dialog';

  changeVariationSelection(values: { attr: string; value: string }[]) {
    for (const x of values) {
      cy.get('ngb-modal-window').find(x.attr).select(x.value);
    }
  }

  save() {
    cy.get('[data-testing-id="confirm"]').click();
  }
}
