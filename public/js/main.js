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

define(function(require) {

    Router   = require('/js/router.js');
    Backbone = require('backbone');

    for(var i = 0; i < window.modules.length;++i) {
        var name = window.modules[i],
            path = '/' + name + '/js/controller.js';
        loadModul(require,path,name);
    }
    
});

var loadedModules = new Object();
var loadModul = function(require,path,name) {
    require([path],function(module) {
        loadedModules[name] = module;
        
        // check if last module is loaded and start application
        if(name === window.modules[window.modules.length-1]) {
            var Application = loadedModules.core;
            
            window.app = new Application();
            window.app.loadModules(loadedModules);
            
            window.router = new Router();
            Backbone.history.start();
            
            window.app.log('[INFO] - all modules loaded successfully');
        }
    })
}