@spock.lang.Unroll
class CheckProofOfConceptSpec extends geb.spock.GebSpec {

    def 'check telephone number is #text '() {
        when:
        to ProofOfConceptPage

        then:
        at ProofOfConceptPage
        customerInfo.text().contains text
        
        where:
        text = '1300 032 032'
    }
}
