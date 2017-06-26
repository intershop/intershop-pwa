@spock.lang.Unroll
class CheckProofOfConceptSpec extends geb.spock.GebSpec {

    def 'check default category of category page is #text '() {
        when:
        to ProofOfConceptPage

        then:
        at ProofOfConceptPage
        category.text() == text
        
        where:
        text = 'ACTION CAMERAS'
    }
}
