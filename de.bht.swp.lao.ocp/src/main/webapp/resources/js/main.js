require.config({
    paths: {
        jquery: 'libs/jquery/jquery-min',
        underscore: 'libs/underscore/underscore-min',
        backbone: 'libs/backbone/backbone-optamd3-min',
        text: 'libs/require/text',
        templates: '../templates'
    }
});

require([
    // Load our app module and pass it to our definition function
    'app',
	'models/user',
], function(App,User){
    // The "app" dependency is passed in as "App"
   $(function() {
		window.app = new App({
			user: new User(),
			debug: true, 
		});
		
		app.init();
	});
});
