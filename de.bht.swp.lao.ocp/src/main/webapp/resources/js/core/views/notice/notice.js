define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var Notice = Backbone.View.extend({
        id: 'notice',
        displayLength: 5000,
        defaultMessage: '',
        
        events: {
            'click a': 'dismiss'
        },
        
        initialize: function() {
            _.bindAll(this, 'render');
            this.message = this.options.message || this.defaultMessage;
            if(_.isArray(this.message))
                this.message = this.message.join('. ');

            this.render();
        },
        
        dismiss: function() {
            $(this.el).slideUp();
            $(this.el).css('z-index', '-2000');
            return false;
        },
        
        render: function() {
            var view = this;
            
            $(this.el).html(this.message + " <span>(<a href='javascript:void(0)'>dismiss</a>)</span>");
            $(this.el).hide();
            $(this.el).css('z-index', '9');
            $('body').append(this.el);
            $(this.el).slideDown();
            window.setTimeout(function() {
                $(this.el).css('z-index', '-2000');
                $(view.el).slideUp();
                window.setTimeout(function() {view.remove();},5000);
            },this.displayLength);
            
            return this;
        }
    });
    return Notice;
});