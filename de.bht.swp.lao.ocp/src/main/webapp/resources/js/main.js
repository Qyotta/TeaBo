require.config({
    paths : {
        jquery : 'libs/jquery/jquery-min',
        underscore : 'libs/underscore/underscore-min',
        backbone : 'libs/backbone/backbone-optamd3-min',
        jqueryui : 'libs/jquery/jquery-ui-1.8.17',
        jquerycollision : 'libs/jquery/jquery-collision-1.0.1',
        text : 'libs/require/text',
        cometd : 'libs/org/cometd',
        jquerycometd : 'libs/jquery/jquery.cometd',
        templates : '../templates'
    }
});

require([
    'jquery',
    'backbone', 
    'core/router/router', 
    'core/controller/application',
    'core/controller/whiteboard',
    'core/controller/toolbar', 
    'core/controller/topbar',
    'core/controller/sidebar',
    'modules/attachment/controller_attachment',
    'modules/note/controller_note',
    'modules/tooltips/controller_tooltips'
], function($, Backbone, Router, Application, Whiteboard, Toolbar, Topbar, Sidebar, Attachment, Note, Tooltips) {
    $(function() {

        var modules = {
            'whiteboard':Whiteboard, 
            'note':Note, 
            'attachment':Attachment,
            'toolbar':Toolbar, 
            'topbar':Topbar,
            'sidebar':Sidebar,
            'tooltips':Tooltips
        };
        
        window.app    = new Application();
        window.app.loadModules(modules);
        
        window.router = new Router();
        Backbone.history.start();
        
        
        
    });
});
