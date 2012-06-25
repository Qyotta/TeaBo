/* Please do not commit this file!
 * This is only a example, you have to costumize your webdriver capabilities by yourself
 *
 * list of some webdrivers:
 * ChromeDriver: http://code.google.com/p/chromedriver/downloads/list
 * FirefoxDriver
 */

// define webdriver desired capabilities
var capabilities = {

    /* use the follow structure:
     *
     * <name>: {
     *     browserName: "<name of the browser>",
     *     "chrome.binary": "/path/to/browser.exe"
     * }
     *
     * to test with these capabilities call your testfile with: $ node test.action.js <name>
     *
     * e.g.
     * chrome: {
     *    browserName: "chrome",
     *    "chrome.binary": "/Applications/Browser/Google Chrome.app/Contents/MacOS/Google Chrome"
     * }
     *
     * to run the test, call
     * $ node test.yourtest chrome
     */

};

exports.capabilities = capabilities;
exports.laoUrl  = 'http://localhost:3000';