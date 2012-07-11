define([
    'jquery',
    'underscore',
    'backbone',
    'text!/infotour/templates/infotour-end.html'
], function($, _, Backbone, InfotourEnd) {
    
    var TooltipsView = Backbone.View.extend({
        el: $('#tooltips'),
        showDialogFlag : "ToolTipFlag",
        events : {
            'click .closeToolTip' :'closeToolTip',
            'click .nextToolTip' :'nextToolTip',
            'click .prevToolTip' :'prevToolTip'
        },
        initialize : function(options) {
            _.bindAll(this,'startTour','nextToolTip','prevToolTip','closeToolTip','getInfoTourTemplates');
            window.app.eventDispatcher.bind('application:modulesLoaded',this.getInfoTourTemplates);
            this.toolTipCnt = 0;
            this.toolTips   = null;
            this.isVisible  = false;
            this.templates  = [];
        },
        render : function() {
            var data = {};
            var compiledTemplate = _.template( this.templates, data );
            this.$el.html(compiledTemplate);
            this.toolTips = $('#tooltips div[data-type="tooltip"]');
        },
        startTour : function() {
            this.render();
            this.toolTipCnt = 0;
            this.isVisible  = true;
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
            var that = this;
            if(!this.toolTipCnt)
                return;
            if(this.toolTipCnt===this.toolTips.length)
                this.closeToolTip();
            
            $(this.toolTips[this.toolTipCnt-1]).fadeOut(500,function() {
                $(that.toolTips[that.toolTipCnt-2]).fadeIn(500);
                that.toolTipCnt--;
            });
        },
        closeToolTip: function() {

            if(this.isVisible) {
                window.app.modules.settings.set(this.showDialogFlag,!$('#showAgain').is(':checked'));
            }

            $(this.toolTips[this.toolTipCnt-1]).fadeOut(500, function() {
                this.isVisible = false;
            });
            
        },
        setCheckbox: function(value){
            $(this.el).find(':checkbox').attr('checked', value);
        },
        getInfoTourTemplates: function() {
            var i    = 0,
                that = this;

            _.each(window.app.modules, function(module,key) {
                if(typeof module.index === 'number') {
                    require(['text!/'+key+'/templates/infotour.html'],function(template) {
                        if(module.index === 0) {
                            if(that.templates[0] === undefined) {
                                that.templates[0] = '';
                            }
                            that.templates[0] += template;
                        } else {
                            if(that.templates[module.index] === undefined) {
                                that.templates[module.index] = '';
                            }
                            that.templates[module.index] += template;
                        }

                        ++i;
                        if(i === window.modules.length) {
                            var unrelevantElements = '';

                            if(that.templates[0] !== undefined) {
                                unrelevantElements = that.templates[0];
                            }

                            that.templates.shift();
                            that.templates = that.templates.join('\n') + unrelevantElements + InfotourEnd;
                            that.render();
                        }
                    });
                } else {
                    ++i;
                }
            });
        }
    });

    return TooltipsView;
});
