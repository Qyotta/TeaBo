define([
    'jquery',
    'underscore',
    'backbone',
    'modules/tooltips/view_tooltips'
], function($, _, Backbone, TooltipsView){
    
    var TooltipsController = function(options){
        _.bindAll(this,'isShowTooltips','showTooltips','openTooltips');
        window.app.eventDispatcher.bind("userSettings:synced",this.isShowTooltips);
        window.app.eventDispatcher.bind("toolbar:showToolTips",this.openTooltips);
        this.initialize();
    };
    
    TooltipsController.prototype = {
        showDialogFlag : "ToolTipFlag",
        initialize: function() {
            window.app.log('tooltips loaded');
            this.view = new TooltipsView();
        },
        isShowTooltips: function() {
            if(this.shouldShowDialog()){
                this.showTooltips();
            }
            else {
                this.view.setCheckbox(true);
            }
        },
        shouldShowDialog : function(){
            if(typeof window.app.user.get("settings").where(this.showDialogFlag)[0] == "undefined" || window.app.user.get("settings").where(this.showDialogFlag)[0].get("value") == "true"){
                return true;
            } else {
                return false;
            }   
        },
        showTooltips: function() {
            this.view.startTour();
        },
        openTooltips: function() {
            this.view.startTour();
        }
    };
    
    return TooltipsController;
});
