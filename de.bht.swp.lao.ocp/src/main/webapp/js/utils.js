
/*
 * function to validate email adresses
 * returns true, if adress matches pattern
 */
function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

// all actions
$(function() {
    $('.exclamation').hover(function(){
        var errors = $('.errors',$(this));
        errors.show();
    },function(){
        var errors = $('.errors',$(this));
        errors.hide();
    });
})