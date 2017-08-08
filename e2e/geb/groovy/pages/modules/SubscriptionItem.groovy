package pages.modules

import geb.Module;
import geb.navigator.Navigator;

class SubscriptionItem extends Module
{

    static content = {
        cell {i -> $("td", i) }
        subscriptionDate        { cell(0).text() }
        subscriptionNumber      { cell(1).find('[data-testing-id="subscription-number-link"]').first().text().trim() }
        subscriptionNumberLink  { cell(1).find('[data-testing-id="subscription-number-link"]') }
        recurrence              { cell(2).text() }
        lastOrder               { cell(3).text() }
        status                  { cell(4).text() }
        orderTotal              { cell(5).text() }
        deactivate              { cell(6).text() }
        delete                  { cell(7).text() }
        details                 { cell(8).text() }
    }

    def openDetails()
    {
        subscriptionNumberLink.click()
    }

}
