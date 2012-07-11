var webdriverjs = require("webdriverjs"),
    // get config data
    config      = require('./config'),
    // get param of test
    capability  = process.argv[2],
    browser     = config.capabilities[capability],
    client      = {};

// if no param is given, close the test
if(capability === undefined) {
    console.error('[ERROR] - please choose a capability you want to test with!');
    return;
}

if(browser === undefined) {
    console.error('[ERROR] - given browser "'+capability+'" wasn\'t found - check your config file');
    return;
}

// initialize webdriver
client = webdriverjs.remote({desiredCapabilities:config.capabilities[capability]});

// run test case
client
    .testMode()
    .init()
    .url(config.url)
    .waitFor('.email', 500)
    .waitFor('.password', 500)
    .click('.button')
    .waitFor('#error', 500)
    .tests.visible("#error", true, "login failed - no credentials typed in")
    .setValue('.email','test-example-this-will-never-exists@should-failed.com')
    .setValue('.password','sdfgzu32f824782f482f')
    .click('.button')
    .waitFor('#error', 500)
    .tests.visible("#error", true, "login failed - wrong credentials typed in")
    .clearElement('.email')
    .clearElement('.password')
    .setValue('.email','max-mustermann@gmail.com')
    .setValue('.password','testtest')
    .click('.button')
    .waitFor('.mainPanel', 500)
    .tests.visible(".mainPanel", true, "login successful - main panel should be visible")
    .end();