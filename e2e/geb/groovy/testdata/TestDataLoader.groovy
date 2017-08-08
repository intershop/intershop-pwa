package testdata;

import java.util.List;
import java.util.Map;
import java.util.Locale;

class TestDataLoader
{
    private static Map<String,List> testData ;
    public static final String defaultFileName = "TestData";
    public static final String defaultLocaleID = "en_US";
    
    private void readTestDataFromFile(String fileName, String localeID)
    {
        testData = new HashMap<String,List>();
        ResourceBundle testDataBundle =
                ResourceBundle.getBundle(fileName,
                new Locale(System.getProperty("url.locale",localeID)));

        Enumeration bundleKeys = testDataBundle.getKeys();

        //System.out.println("TestData loaded from: FileName \t= " + fileName + ".properties");
        //System.out.println("TestData loaded with: LocaleID \t= " + localeID);
        
        while (bundleKeys.hasMoreElements())
        {
            String key = (String)bundleKeys.nextElement();
            String value = testDataBundle.getString(key);
            if(!value.contains("["))
                value="["+value+"]"
            
          //  System.out.println(key + "\t=" + value);

            testData.put(key.toString(),Eval.me(value))
        }
    }

    /**
     * default usage reads TestData ResourceBundle from <br/>
     * src/remoteTest/resources/TestData.properties and TestData_en_US.properties
     * @return a Map containing the properties stored in the files read
     */
    public static Map<String,List> getTestData()
    {
        if(testData==null){
            new TestDataLoader().readTestDataFromFile(defaultFileName,defaultLocaleID);
        }
        return testData;
    }
    /**
     * reads TestData ResourceBundle from given fileName <br/>
     *  - can also contain sub-directories (use platform specific File.seperator) <br/>
     * src/remoteTest/resources/&lt;fileName&gt;.properties and &lt;fileName&gt;_en_US.properties
     * e.g.: src/remoteTest/resources/OrderProductWithWarrantiesSpec/TestData <br/>
     * @return a Map containing the properties stored in the files read
     */
    public static Map<String,List> getTestData(String fileName)
    {
        if(testData==null){
            new TestDataLoader().readTestDataFromFile(fileName,defaultLocaleID);
        }
        return testData;
    }
    /**
     * reads TestData ResourceBundle from given fileName and localeID <br/>
     *  - can also contain sub-directories (use platform specific File.seperator) <br/>
     * src/remoteTest/resources/&lt;fileName&gt;.properties and &lt;fileName&gt;_&lt;localeID&gt;.properties
     * e.g.: OrderProductWithWarrantiesSpec/TestData, de_DE
     * @return a Map containing the properties stored in the files read
     */
    public static Map<String,List> getTestData(String fileName, String localeID)
    {
        if(testData==null){
            new TestDataLoader().readTestDataFromFile(fileName, localeID);
        }
        return testData;
    }
}
