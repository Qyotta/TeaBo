var webdriverjs = require("webdriverjs"),
    // get config data
    config      = require('./config'),
    // get param of test
    capability  = process.argv[2],
    browser     = config.capabilities[capability],
    assert      = require("assert"),
    username    = new Date().getTime(),
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

function verifyIsVisible(found,text) {
    if(found.value === -1) {
        console.log('\033[32m✔\033[0m\t'+text);//verify error should not appear');
    } else {
        console.log('\033[31m✖\033[0m\t'+text);//verify error should not appear');
    }
}

// run test case
client
    .testMode()
    .init()
    .url(config.laoUrl)
    .waitFor('.loginContainer a', 500)
    .click('.loginContainer a', function() {
        console.log('\033[33m---------------------- open registration ----------------------\033[0m');
    })
    .click('button.submitButton')
    .tests.visible('.loginContainer', true, 'cancel registration')
    .click('.loginContainer a')
    .click('input.submitButton', function() {
        console.log('\n\033[33m------------ submit form without typing anything ------------\033[0m');
    })
    .tests.visible('.emailerror', true, 'email error should appear')
    .tests.visible('.pwerror', true, 'password error should appear')
    .isVisible('.verifyerror', function(found) { verifyIsVisible(found,'verify-error should not appear'); })
    .click('button.submitButton')
    .click('.loginContainer a')
    .setValue('input[name="email"]','wrongEmailAdress!!')
    .click('input.submitButton', function() {
        console.log('\n\033[33m------------ submit form with wrong email adress ------------\033[0m');
    })
    .tests.visible('.emailerror', true, 'email error should appear')
    .tests.visible('.pwerror', true, 'password error should appear')
    .isVisible('.verifyerror', function(found) { verifyIsVisible(found,'verify-error should not appear'); })
    .click('button.submitButton')
    .click('.loginContainer a')
    .setValue('input[name="email"]','richtige@email.de')
    .setValue('input[name="password"]','testtest')
    .setValue('input[name="passwordvalidate"]','testtes!')
    .click('input.submitButton', function() {
        console.log('\n\033[33m----------- submit form with not equal passowrds -----------\033[0m');
    })
    .isVisible('.emailerror', function(found) { verifyIsVisible(found,'email error should not appear'); })
    .isVisible('.pwerror', function(found) { verifyIsVisible(found,'password error should not appear'); })
    .tests.visible('.verifyerror', true, 'verify error should appear')
    .click('button.submitButton')
    .click('.loginContainer a')
    .setValue('input[name="email"]','max-mustermann@gmail.com')
    .setValue('input[name="password"]','aaaaaaaaa')
    .setValue('input[name="passwordvalidate"]','aaaaaaaaa')
    .click('input.submitButton', function() {
        console.log('\n\033[33m------ submit form with correct data but existing user ------\033[0m');
    })
    .waitFor('#error', 500)
    .tests.visible("#error", true, "login failed - no credentials typed in")
    .click('button.submitButton')
    .click('.loginContainer a')
    .setValue('input[name="email"]',username+'@test.de')
    .setValue('input[name="password"]','aaaaaaaaa')
    .setValue('input[name="passwordvalidate"]','aaaaaaaaa')
    .click('input.submitButton', function() {
        console.log('\n\033[33m--------------- submit form with correct data ---------------\033[0m');
    })
    .waitFor('.mainPanel', 500)
    .tests.visible(".mainPanel", true, "registration successful - main panel should be visible")
    .click('a[href="logout"]')
    .click('input[value="Yes"]', function() {
        console.log('\n\033[33m---------------------- check logout/-in ---------------------\033[0m');
    })
    .waitFor('.loginContainer', 500)
    .tests.visible(".loginContainer", true, "logout successful")
    .setValue('.email','max-mustermann2@gmail.com')
    .setValue('.password','aaaaaaaaa')
    .click('.button')
    .waitFor('.mainPanel', 500)
    .tests.visible(".mainPanel", true, "login successful - main panel should be visible")
    .end();