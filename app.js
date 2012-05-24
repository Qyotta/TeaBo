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
    moduleStyles    = [],
    moduleNames     = [];

fs.readdirSync('./modules').forEach(function(file) {
    var module = require('./modules/'+file+'/module.js');
    
    moduleTemplates = moduleTemplates.filter(function(e){return e});
    moduleTemplates.push(module.template);
    moduleStyles    = moduleStyles.filter(function(e){return e});
    if(module.style) {
        moduleStyles.push('<link rel="stylesheet" href="'+file+'/'+module.style+'">');
    }
    moduleNames.push(file);
    
    app.use('/'+file,express.static(application_root+'/modules/'+file+'/public'));
    module.init();
    registerRestServices(module.rest);
    
    console.log(file + ' module loaded');
})

app.get('/', function(req,res) {
    var header = fs.readFileSync('./templates/header.tpl', 'utf8'),
        script = '<script>var modules = [\'' + moduleNames.join('\',\'') + '\']; </script>'
    
    res.send(header + script + '\n\n' + moduleStyles.join('\n') + '\n\n' + moduleTemplates.join('\n'));
})

function registerRestServices(rest) {
    if(rest) {
        for(var i = 0; i < rest.length; ++i) {
            var url = rest[i].url;
            var method = rest[i].type;
            var callback = rest[i].callback;
            
            switch(method){
                case 'get':
                    app.get(url,callback);
                    break;
                case 'post':
                    app.post(url,callback);
                    break;
                case 'delete':
                    app.delete(url,callback);
                    break;
                case 'put':
                    app.put(url,callback);
                    break;
            }    
        }
    }
}

app.listen(3000);