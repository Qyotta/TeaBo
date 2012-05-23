var application_root = __dirname,
    express          = require("express"),
    path             = require("path"),
    mongoose         = require('mongoose'),
    fs               = require('fs');

var app              = express.createServer();

mongoose.connect('mongodb://localhost/lao');

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.cookieParser('lao'));
    app.use(express.methodOverride());
    app.use(express.session({secret:'lao'}));
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use('/user',express.static(application_root+'/modules/user/public'));
    app.use('/whiteboard',express.static(application_root+'/modules/whiteboard/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('views', path.join(application_root, "views"));
    app.set('view engine', 'jade')
});

// require models
var controller = require('./controller/app');

controller.registerRestServices(app);

fs.readdirSync('./modules').forEach(function(file) {
    var module = require('./modules/'+file+'/module.js');
    console.log(file + ' module loaded');
    
    app.use('/'+file,express.static(application_root+'/modules/'+file+'/public'));
    module.init();
})

app.listen(3000);