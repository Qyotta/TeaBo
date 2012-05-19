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

var userID           = 0,
    assignmentID     = 0,
    settingsID       = 0,
    whiteboardID     = 0,
    whiteboardItemID = 0
    User = mongoose.model('User', new mongoose.Schema({
        _id       : Number,
        email     : String,
        password  : String,
        firstname : String,
        lastname  : String,
        position  : String
    })),
    Assignment = mongoose.model('Assignment', new mongoose.Schmea({
        _id          : Number,
        color        : String,
        isOwner      : Boolean,
        userID       : Number,
        whiteboardID : Number
    })),
    Settings = mongoose.model('Settings', new mongoose.Schema({
        _id    : Number,
        key    : String,
        value  : String,
        userID : Number
    })),
    Whiteboard = mongoose.model('Whiteboard', new mongoose.Schema({
        _id  : Number,
        name : String
    })),
    WhiteboardItem = mongoose.model('WhiteboardItem', new mongoose.Schema({
        _id          : Number,
        editing      : Boolean,
        orderIndex   : Number,
        x            : Number,
        y            : Number,
        creatorID    : Number,
        whiteboardID : Number
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

app.get('/user',function(req,res) {
    User.find(function(err,users) {
        res.send(JSON.stringify(users));
    })
})

app.post('/user/login',function(req,res) {
    var query = {'email':req.body.email,'password':req.body.password}
    console.log('check auth for ',query);
    User.findOne(query,function(err,user) {
        if(!err && user) {
            console.log('login successful for ',user);
            res.send(user);
        } else {
            console.log('access denied!');
            res.send('');
        }
    })
})



app.listen(3000);