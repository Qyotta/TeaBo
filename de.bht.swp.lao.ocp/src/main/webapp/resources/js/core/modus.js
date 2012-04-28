define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var WhiteboardModus = {
            HAND : 'HAND',
            SELECT : 'SELECT',
            SELECTING:'SELECTING',
            EDIT: 'EDIT',
    };
    
    return WhiteboardModus;
});