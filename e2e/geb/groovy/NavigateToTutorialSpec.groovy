class NavigateToTutorialSpec extends geb.spock.GebSpec {

    def 'check content of example page '() {
        when:
        to ProofOfConceptPage
        heroesLink.click()
        
        then:
        waitFor { title == 'Tutorial: Tour of Heroes - ts - TUTORIAL' }
        $('h1.hero-title').text() == 'TUTORIAL: TOUR OF HEROES'
    }
}
