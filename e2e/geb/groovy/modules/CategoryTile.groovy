package modules

import geb.Module;
import geb.navigator.Navigator;

class CategoryTile extends Module
{
    def categoryID;
    
    static content = {       
        panel { $("div[data-testing-id='category-"+categoryID+"']")}
        nameLabel {panel.find("h3").text()}
    }
    
    Navigator click(){
        waitFor{panel.find("a").first().displayed}
        panel.find("a").first().click()
    }
}
