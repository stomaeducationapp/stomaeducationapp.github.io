using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.WebDriver;
using OpenQA.Selenium.FireFox;

namespace HelpPageTest
{
    [TestClass]
    public class FireFoxTest
    {
        [TestMethod]
        public void InitialLoad()
        {
            using (IWebDriver driver = new FirefoxDriver())
            {
                driver.Navigate().GoToURL("http://localhost:51814/HelpPage.html");

                IWebElement element = driver.FindElement(By.id("home"));

                driver.Close();
            }
        }
    }
}