package de.bht.swp.lao.ocp.selenium;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class LoginTest {
  private static WebDriver driver;
  private static String baseUrl;

  @BeforeClass
  public static void setUpClass() throws Exception {
    driver = new FirefoxDriver();
    baseUrl = "http://localhost:8080/";
    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
  }

  @Test
  public void shouldLoginAndLogout() throws Exception {
    driver.get(baseUrl + "/de.bht.swp.lao.ocp/user/login.htm");
    driver.findElement(By.id("email")).clear();
    driver.findElement(By.id("email")).sendKeys("marcus_berlin@gmx.net");
    driver.findElement(By.id("password")).clear();
    driver.findElement(By.id("password")).sendKeys("pw");
    driver.findElement(By.cssSelector("input.button")).click();
    driver.findElement(By.linkText("Log out")).click();
    driver.findElement(By.cssSelector("input[type=\"submit\"]")).click();
  }

  @Test
  public void shoulNotdLoginIfUsernameIsWrong() throws Exception {
    driver.get(baseUrl + "/de.bht.swp.lao.ocp/user/login.htm");
    driver.findElement(By.id("email")).clear();
    driver.findElement(By.id("email")).sendKeys("sadasfdafdfdsojojkodkjodksa@sjos.co");
    driver.findElement(By.id("password")).clear();
    driver.findElement(By.id("password")).sendKeys("pw");
    driver.findElement(By.cssSelector("input.button")).click();

    // password field needs to be empty
    assertEquals("", driver.findElement(By.id("password")).getText());

    // error message
    assertThat("Error marker is shown", isElementPresent(By.className("exclamation")), is(true));
  }

  public boolean verifyText(String s) {
    return driver.getPageSource().contains(s);
  }

  @AfterClass
  public static void tearDown() {
    driver.quit();
  }

  private boolean isElementPresent(By by) {
    try {
      driver.findElement(by);
      return true;
    } catch (NoSuchElementException e) {
      return false;
    }
  }
}
