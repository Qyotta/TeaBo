/* PLEASE DO NOT COMMIT THIS FILE!!!
 * This is only a example, you have to costumize your webdriver capabilities by yourself
 */

var fs      = require('fs'),
    configs = JSON.parse(fs.readFileSync('package.json', 'utf8'));

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
    */ chrome: {
         browserName: "chrome",
         "chrome.binary": "/Applications/Browser/Google Chrome.app/Contents/MacOS/Google Chrome"
      }
    /*
     * to run the test, call
     * $ node test.yourtest chrome
     */

};

exports.capabilities = capabilities;
exports.url          = configs.server.express.host+':'+configs.server.express.port;
