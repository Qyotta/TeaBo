define([ 
    'jquery', 
    'underscore', 
    'backbone',
    'text!templates/modules/tooltips/tooltips.html'
], function($, _, Backbone, TooltipsTemplate) {
    
    var TooltipsView = Backbone.View.extend({
        el: $('#tooltips'),
        showDialogFlag : "ToolTipFlag",
        events : {
            'click .closeToolTip' :'closeToolTip',
            'click .nextToolTip' :'nextToolTip',
            'click .prevToolTip' :'prevToolTip'
        },
        initialize : function(options) {
            _.bindAll(this,'startTour','nextToolTip','prevToolTip','closeToolTip');
            this.toolTipCnt = 0;
            this.toolTips   = null;
            
            this.render();
        },
        render : function() {
            var data = {};
            var compiledTemplate = _.template( TooltipsTemplate, data );
            this.el.html(compiledTemplate);
            this.toolTips = $('#tooltips div[data-type="tooltip"]');
        },
        startTour : function() {
            this.toolTipCnt = 0;
            this.nextToolTip();
            return false;
        },
        nextToolTip: function() {
            var that = this;
            if(this.toolTipCnt===0) {
                $(this.toolTips[0]).fadeIn(500);
                this.toolTipCnt++;
            } else {
                $(this.toolTips[this.toolTipCnt-1]).fadeOut(500,function() {
                    $(that.toolTips[that.toolTipCnt]).fadeIn(500);
                    that.toolTipCnt++;
                });
            }   
        },
        prevToolTip: function() {
            if(!this.toolTipCnt)
                return;
            if(this.toolTipCnt===this.toolTips.length)
                this.closeToolTip();
            
            $(this.toolTips[this.toolTipCnt-1]).fadeOut(500,function() {
                $(this.toolTips[this.toolTipCnt-2]).fadeIn(500);
                this.toolTipCnt--;
            });
        },
        closeToolTip: function() {
            window.app.modules.userSettings.set(this.showDialogFlag,!$('#showAgain').is(':checked'));
            $(this.toolTips[this.toolTipCnt-1]).fadeOut(500);
        },
        setCheckbox: function(value){
            this.el.find(':checkbox').attr('checked', value);
        }
    });

    return TooltipsView;
});
