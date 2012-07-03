// define vars
var application_root = __dirname,
    express          = require("express"),
    path             = require("path"),
    mongoose         = require('mongoose'),
    fs               = require('fs'),
    configs          = JSON.parse(fs.readFileSync('package.json', 'utf8')),
    faye             = require('faye'),
    util             = require('./rest/utils'),
    minfier          = require('./utils/minifier'),
    bayeux           = new faye.NodeAdapter({mount: '/rest', timeout: 120}),
    client           = new faye.Client(configs.server.faye.host + ':' + configs.server.faye.port + '/rest'),
    app              = express.createServer();

// connect to mongodb
mongoose.connect(configs.server.mongo.host);

// configure express server
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.cookieParser('lao'));
    app.use(express.methodOverride());
    app.use(express.session({secret:'lao'}));
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('views', path.join(application_root, "views"));
    app.set('view engine', 'jade');
});


// load lao modules
var moduleTemplates = [],
    moduleStyles    = [],
    moduleNames     = [];

fs.readdirSync('./modules').forEach(function(file) {
    var module = require('./modules/'+file+'/module.js'),
        name   = file;
    
    moduleTemplates = moduleTemplates.filter(function(e){return e;});
    moduleTemplates.push(module.template);

    if(module.style) {
        // read file content of all css files
        fs.readdirSync('./modules/'+name+'/public/css').forEach(function(file) {
            fs.readFile('./modules/'+name+'/public/css/'+file, 'utf8', function (err,data) {
                if (err) {
                    console.log(err);
                    return false;
                }
                moduleStyles.push(minfier.compressCSS(data));
            });
        });
    }
    moduleNames.push(name);
    
    app.use('/'+name,express.static(application_root+'/modules/'+name+'/public'));
    module.init();
    
    registerRestServices(module.rest);
    registerIOServices(module.io);
    console.log(file + ' module loaded');
});

// generate index.html
app.get('/', function(req,res) {
    var header = fs.readFileSync('./templates/header.tpl', 'utf8'),
        script = '<script>var modules = [\'' + moduleNames.join('\',\'') + '\']; </script>';
    
    res.send(header + script + '\n<style type="text/css">' + moduleStyles.join('') + '</style>\n\n' + moduleTemplates.join('\n'));
});

// register rest services
registerRestServices(util.rest);
function registerRestServices(rest) {
    if(rest) {
        console.log(rest);
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

// register IO services
function registerIOServices(io) {
    if(io) {
        bayeux.bind('publish', function(client_id,channel,obj) {
            console.log('got message on ',channel, obj);
            if(io[channel]) {
                console.log('channel found');
                io[channel](bayeux,channel,obj);
            }
        });
    }
}

bayeux.bind('handshake', function(clientId) {
    console.log('user connected to faye');
    client.publish(clientId,'meta/handshake',true);
});

bayeux.listen(configs.server.faye.port);
app.listen(configs.server.express.port);