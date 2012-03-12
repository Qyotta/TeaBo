require.config({
    paths: {
        jquery: 'libs/jquery/jquery-min',
        underscore: 'libs/underscore/underscore-min',
        backbone: 'libs/backbone/backbone-optamd3-min',
        text: 'libs/require/text',
        templates: '../templates'
    }
});

require([
    // Load our app module and pass it to our definition function
    'backbone',
    'app',
], function(Backbone,App){
    // The "app" dependency is passed in as "App"
   $(function() {
        window.app = new App({
            debug: true, 
        });
        
        app.init();
        
        Backbone.history.start();
    });
});
