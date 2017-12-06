package pages

import pages.StorefrontPage

class HomePage extends StorefrontPage
{


    static url= StorefrontPage.url + "";

    static at =
    {
        //The homepage must get the class "homepage" in backoffice
        waitFor{$("div",class:"homepage").size()>0}
    }

    static content =
    {
        signInLink(required:false){$("a",class:"my-account-link my-account-login")}
        catalogBar {$("ul",class:contains("navbar-nav"))}
        registerLink {$("a",class:"my-account-link my-account-register")}
        logoutLink {$("a",class:"my-account-link my-account-logout")}

    }

    //------------------------------------------------------------
    // Page checks
    //------------------------------------------------------------

    def isSignedIn(bool)
    {
        bool == (signInLink.size()==0)
    }

    //------------------------------------------------------------
    // link functions
    //------------------------------------------------------------
    def pressLogIn()
    {
        signInLink.click()
    }

    def pressLogOut()
    {
        logoutLink.click()
    }

    def selectCatalog(channel)
    {
        $("a[data-testing-id='"+channel+"-link']").click()
    }

    def clickCategoryLink(categoryId) {
        $('[data-testing-id="'+categoryId+'-link"]').click()
    }
}


