
waiting {
    timeout = 10
    retryInterval = 0.5
}

io.github.bonigarcia.wdm.ChromeDriverManager.getInstance().setup()
driver = { new org.openqa.selenium.chrome.ChromeDriver() }
//io.github.bonigarcia.wdm.FirefoxDriverManager.getInstance().setup()
//driver = { new org.openqa.selenium.firefox.FirefoxDriver() }

baseUrl = "http://localhost:4200/"

reporter = new geb.report.CompositeReporter(
    new geb.report.ScreenshotReporter(), new geb.report.PageSourceReporter())
reportsDir = "build/geb-reports"
reportOnTestFailureOnly = false

atCheckWaiting = true
baseNavigatorWaiting = true
