require.config({
    paths : {
        jquery : 'libs/jquery/jquery-min',
        underscore : 'libs/underscore/underscore-min',
        backbone : 'libs/backbone/backbone-optamd3-min',
        jqueryui : 'libs/jquery/jquery-ui-1.8.17',
        text : 'libs/require/text',
        cometd : 'libs/org/cometd',
        jquerycometd : 'libs/jquery/jquery.cometd',
        templates : '../templates',
        collections : 'collections',
        models : 'models',
        views : 'views',
        router : 'router',
        controllers : 'controllers'
    }
});

require([
// Load our app module and pass it to our definition function
 'backbone', 'controllers/application', 'controllers/whiteboard', 'controllers/note', 'controllers/toolbar', 'router/router' ], 
function(Backbone, ApplicationController, WhiteboardController, NoteController, ToolbarController, AppRouter) {
    // The "app" dependency is passed in as "App"
    $(function() {

        window.applicationController = new ApplicationController();
        window.whiteboardController  = new WhiteboardController();
        window.noteController        = new NoteController();
        window.toolbarController     = new ToolbarController();
        
        window.router = new AppRouter();
        Backbone.history.start();

    });
});
