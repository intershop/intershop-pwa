class ProofOfConceptPage extends geb.Page {
    
    static at = { title == "ProofOfConcept" }
    
    static content = {
        welcomeTitle { $('#welcome-title') }
        heroesLink { $('#heroes-link') }
    }
}
