package pages

import geb.Page

class ProofOfConceptPage extends Page {

    static at = { title == "Intershop Progressive Web App" }

    static content = {
        category(required:false) { $('h1') }
        customerInfo { $('ul.customer-info') }
    }
}
