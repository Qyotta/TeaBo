var application_root = __dirname,
    express 		 = require("express"),
    path 			 = require("path"),
    mongoose 		 = require('mongoose');

var app = express.createServer();
mongoose.connect('mongodb://localhost/lao');

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('views', path.join(application_root, "views"));
    app.set('view engine', 'jade')
});

app.get('/',function(req,res) {
	res.send('Hello nodeJS App!');
});

app.listen(3000);