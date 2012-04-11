require.config({
    paths : {
        jquery : 'libs/jquery/jquery-min',
        underscore : 'libs/underscore/underscore-min',
        backbone : 'libs/backbone/backbone-optamd3-min',
        jqueryui : 'libs/jquery/jquery-ui-1.8.17',
        text : 'libs/require/text',
        cometd : 'libs/org/cometd',
        jquerycometd : 'libs/jquery/jquery.cometd',
        templates : '../templates'
    }
});

require([
    'jquery',
    'backbone', 
    'core/models/application',
    'core/router/router', 
    'core/controller/whiteboard',
    'core/controller/toolbar', 
    'core/controller/topbar',
    'controller/note'
], function($, Backbone, Application, Router, Whiteboard, Note, Toolbar, Topbar) {
    $(function() {

        var modules = {
            'whiteboard':Whiteboard, 
            'note':Note, 
            'toolbar':Toolbar, 
            'topbar':Topbar
        };
        
        app    = new Application();
        router = new Router();
        Backbone.history.start();
        
        app.loadModules(modules);
        
    });
});
