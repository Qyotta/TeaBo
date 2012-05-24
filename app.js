var application_root = __dirname,
    express          = require("express"),
    path             = require("path"),
    mongoose         = require('mongoose'),
    fs               = require('fs'),
    app              = express.createServer();

mongoose.connect('mongodb://localhost/lao');

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.cookieParser('lao'));
    app.use(express.methodOverride());
    app.use(express.session({secret:'lao'}));
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('views', path.join(application_root, "views"));
    app.set('view engine', 'jade')
});


var moduleTemplates = [],
    moduleNames     = [];

fs.readdirSync('./modules').forEach(function(file) {
    var module = require('./modules/'+file+'/module.js');
    
    moduleTemplates = moduleTemplates.filter(function(e){return e});
    moduleTemplates.push(module.template);
    moduleNames.push(file);
    
    app.use('/'+file,express.static(application_root+'/modules/'+file+'/public'));
    module.init();
    
    console.log(file + ' module loaded');
})

app.get('/', function(req,res) {
    var header = fs.readFileSync('./templates/header.tpl', 'utf8'),
        script = '<script>var modules = [\'' + moduleNames.join('\',\'') + '\']; </script>'
    
    res.send(header + script + '\n\n' + moduleTemplates.join('\n'));
})

app.listen(3000);