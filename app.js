var application_root = __dirname,
    express          = require("express"),
    path             = require("path"),
    mongoose         = require('mongoose');

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

var userID = 0,
    User   = mongoose.model('User', new mongoose.Schema({
        _id         : Number,
        email       : String,
        firstname   : String,
        lastname    : String,
        position    : String,
        whiteboards : {
            own: [],
            assigned: []
        }
    }));
    
app.post('/user', function(req,res) {
    var user = new User({
        _id: ++userID,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        position: req.body.position
    });
    user.save(function(err) {
        if(!err) {
            console.log('user created');
        } else {
            console.log('[ERROR] ',err);
        }
    });
    res.send(user);
});

app.listen(3000);