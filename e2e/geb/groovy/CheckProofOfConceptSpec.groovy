class CheckProofOfConceptSpec extends geb.spock.GebSpec {

    def 'check content of example page '() {
        when:
        to ProofOfConceptPage

        then:
        at ProofOfConceptPage
        welcomeTitle.text() == 'Welcome to app!!'
        heroesLink.displayed
    }
}
