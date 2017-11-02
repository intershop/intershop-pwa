
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
    // when system property 'geb.env' is set to 'ci' use a headless Chrome driver
    ci {
        driver = {
            io.github.bonigarcia.wdm.ChromeDriverManager.getInstance().setup()

            def opt = new org.openqa.selenium.chrome.ChromeOptions()
            opt.addArguments("headless", "disable-gpu", "--window-size=1024,768")
            new org.openqa.selenium.chrome.ChromeDriver(opt)
        }
    }
}
