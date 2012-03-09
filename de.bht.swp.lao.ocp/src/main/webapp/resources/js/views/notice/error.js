define([
    'jquery',
    'underscore',
    'backbone',
	'views/notice/notice',
], function($, _, Backbone,Notice){
	var Error = Notice.extend({
		id: 'error',
		displayLength: 15000,
		defaultMessage: 'Uh oh! Something went wrong. Please try again.'
	});

	return Error;
});