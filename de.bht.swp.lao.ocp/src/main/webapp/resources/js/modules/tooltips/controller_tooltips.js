define([
    'jquery',
    'underscore',
    'backbone',
    'modules/tooltips/view_tooltips'
], function($, _, Backbone, TooltipsView){
    
    var TooltipsController = function(options){
        _.bindAll(this,'isShowTooltips','showTooltips','openTooltips');
        window.app.eventDispatcher.bind("whiteboard:open",this.isShowTooltips);
        window.app.eventDispatcher.bind("toolbar:showToolTips",this.openTooltips);
        this.initialize();
    };
    
    TooltipsController.prototype = {
        initialize: function() {
            window.app.log('tooltips loaded');
            this.view = new TooltipsView();
        },
        isShowTooltips: function() {
            // check if tooltips be allowed to open
            var that = this;
            $.ajax({
                url: config.contextPath+"/user/showAgain.htm",
                type: 'POST',
                success: function(jsonData) {
                    if(jsonData.value === false) {
                        window.app.log('open tooltips');
                        that.showTooltips();
                    }
                }
            });
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
