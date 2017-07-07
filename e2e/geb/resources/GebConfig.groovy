
baseUrl = "http://localhost:4200/"

waiting {
    timeout = 10
    retryInterval = 0.5
    includeCauseInMessage = true
}

reportsDir = "build/reports/geb"

//reportsDir = "target/geb-reports"
reportOnTestFailureOnly = true

atCheckWaiting = true
baseNavigatorWaiting = true

driver = { 
    io.github.bonigarcia.wdm.ChromeDriverManager.getInstance().setup()
    new org.openqa.selenium.chrome.ChromeDriver()
//    io.github.bonigarcia.wdm.FirefoxDriverManager.getInstance().setup()
//    driver = { new org.openqa.selenium.firefox.FirefoxDriver() }
}

environments {
    // when system property 'geb.env' is set to 'ci' use a PhantomJS driver
    ci {
        driver = {
            io.github.bonigarcia.wdm.PhantomJsDriverManager.getInstance().setup()
            def d = new org.openqa.selenium.phantomjs.PhantomJSDriver()
            d.manage().window().size = new org.openqa.selenium.Dimension(1200, 720)
            d
        }
    }
}
