package pages;

import geb.Page

class ProofOfConceptPage extends Page {

    static at = { title == "REST based storefront Proof of Concept" }

    static content = {
        category(required:false) { $('h1') }
        customerInfo { $('ul.customer-info') }
    }
}
