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
 'controllers/application', 'controllers/whiteboard' ], 
function(ApplicationController, WhiteboardController) {
    // The "app" dependency is passed in as "App"
    $(function() {

        window.applicationController = new ApplicationController();
        window.whiteboardController = new WhiteboardController();

    });
});
