require.config({
    paths : {
        jquery : 'libs/jquery/jquery-min',
        underscore : 'libs/underscore/underscore-min',
        backbone : 'libs/backbone/backbone-optamd3-min',
        jqueryui : 'libs/jquery/jquery-ui-1.8.17',
        jquerycollision : 'libs/jquery/jquery-collision-1.0.1',
        text : 'libs/require/text',
        faye : 'libs/faye/faye-browser-min',
        templates : '../templates',
        cometd : 'libs/org/cometd',
        jquerycometd : 'libs/jquery/jquery.cometd',
    }
});

define(function(require) {
    var Router   = require('/js/router.js'),
        Backbone = require('backbone'),
        Application = require('/core/js/controller.js');

    window.app = new Application();
    
    window.router = new Router();
    Backbone.history.start();

    for(var i = 0; i < window.modules.length;++i) {
        var name = window.modules[i],
            path = '/' + name + '/js/controller.js';
        loadModul(require,path,name);
    }    
});

var loadedModules = new Object();
var loadModul = function(require,path,name) {
    require([path],function(module) {
        window.app.loadModules(name,module);
    })
}