class ProofOfConceptPage extends geb.Page {
    
    static at = { title == "REST based storefront Proof of Concept" }
    
    static content = {
        category { $('h1') }
    }
}
