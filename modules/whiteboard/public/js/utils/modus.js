define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){
    var WhiteboardModus = {
            HAND : 'HAND',
            SELECT : 'SELECT',
            SELECTING:'SELECTING',
            MULTISELECT:'MULTISELECT',
            MULTISELECTING:'MULTISELECTING',
            EDIT: 'EDIT',
    };
    
    return WhiteboardModus;
});