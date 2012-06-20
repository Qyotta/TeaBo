define([
    '/user/js/views/logoutDialog.js'
], function(LogoutDialogView){
    
    var UserController = function(options){

        if(!window.app.logoutDialogView){
            window.app.logoutDialogView = new LogoutDialogView();
        }

    };
    
    return UserController;
});