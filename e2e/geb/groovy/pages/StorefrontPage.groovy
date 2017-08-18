package pages

import geb.Page
import modules.Header

class StorefrontPage extends Page
{
    //StorefrontPage is an abstract page for all Pages to have in store
    //Header, Footer and basic functionalities
     static url= "/";


    static content =
    {
        header {module Header,$('header[data-testing-id="page-header"]')}
    }

    static at =
    {
        waitFor{$('header[data-testing-id="page-header"]').size() > 0}
    }


    def sleepForNSeconds(int n)
    {
        def originalMilliseconds = System.currentTimeMillis()
        waitFor(n + 1)
        {
            (System.currentTimeMillis() - originalMilliseconds) > (n * 1000)
        }
    }

    String metaDescription() {
        return $("meta[name='description']").@content
    }

    String metaKeywords() {
        return $("meta[name='keywords']").@content
    }

    String metaRobots() {
        return $("meta[name='robots']").@content
    }

    def linkRelNext() {
        return $("link[rel='next']")
    }

    def linkRelPrev() {
        return $("link[rel='prev']")
    }
}
