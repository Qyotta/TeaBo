require.config({
    paths : {
        underscore : 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        jquery : 'libs/jquery/jquery',
        jqueryui : 'libs/jquery/jquery-ui-1.8.21.custom.min',
        jquerycollision : 'libs/jquery/jquery-collision-1.0.1',
        jqueryfancy : 'libs/jquery/jquery.fancybox.pack',
        text : 'libs/require/text',
        faye : 'libs/faye/faye-browser-min',
        templates : '../templates',
    },
    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
    }
});

define(function(require) {
    var Router      = require('/js/router.js'),
        Backbone    = require('backbone'),
        Application = require('/core/js/controller.js');

    window.app = new Application();
    window.app.startClientIO();
    window.router = new Router();
    Backbone.history.start();

    for(var i = 0; i < window.modules.length;++i) {
        var name = window.modules[i],
            path = '/' + name + '/js/controller.js';
        loadModul(require,path,name);
    }
});

var loadedModules = 0;
var loadModul = function(require,path,name) {

    function compareIndex(a,b) {
        return a.index < b.index;
    }

    require([path],function(module) {
        window.app.loadModules(name,module);
        ++loadedModules;
        if(window.modules.length === loadedModules) {
            window.modules.sort(compareIndex);
            window.app.eventDispatcher.trigger('application:modulesLoaded');
        }
    });
};