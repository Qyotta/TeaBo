define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/notice/notice',
], function($, _, Backbone,Notice){
    var Error = Notice.extend({
        id: 'error',
        displayLength: 5000,
        defaultMessage: 'Uh oh! Something went wrong. Please try again.'
    });

    return Error;
});