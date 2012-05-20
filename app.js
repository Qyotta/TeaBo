var application_root = __dirname,
    express          = require("express"),
    path             = require("path"),
    mongoose         = require('mongoose');

var app = express.createServer();
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

var userID           = 0,
    assignmentID     = 0,
    whiteboardID     = 0,
    whiteboardItemID = 0,
    Settings = new mongoose.Schema({
        key    : String,
        value  : String,
        userID : Number
    }),
    User = mongoose.model('User', new mongoose.Schema({
        email       : String,
        password    : String,
        firstname   : String,
        lastname    : String,
        position    : String,
        settings    : [Settings],
        assignments : [Assignment]
    })),
    Assignment = mongoose.model('Assignment', new mongoose.Schema({
        color      : [Number],
        isOwner    : Boolean,
        whiteboard : [Whiteboard]
    })),
    Whiteboard = mongoose.model('Whiteboard', new mongoose.Schema({
        name  : String,
        items : [WhiteboardItem]
    })),
    WhiteboardItem = mongoose.model('WhiteboardItem', new mongoose.Schema({
        editing      : Boolean,
        orderIndex   : Number,
        x            : Number,
        y            : Number,
        creator      : [User]
    }));
    
app.post('/user', function(req,res) {
    var user = new User({
        email: req.body.email,
        password: req.body.password,
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
            req.session.user = user;
            res.send(user);
        } else {
            console.log('access denied!');
            res.send('');
        }
    })
})

app.post('/user/logout',function(req,res) {
    req.session.user = null;
    res.send('true');
})

app.get('/user/session',function(req,res) {
    if(req.session.user){
        res.header('Content-Type','application/json');
        res.send(req.session.user);
    } else {
        res.send({});
    }
})

app.post('/user/settings',function(req,res) {
    res.send('true');
})

app.get('/whiteboard', function(req,res) {
    var result = Array();
    if(req.session.user) {
        User.findById(req.session.user._id,function(err,user) {
            res.send(user.assignments);
        })
    } else {
        res.send('');
    }
})

app.post('/whiteboard', function(req,res) {
    var whiteboard = new Whiteboard({
        name: req.body.name
    });
    whiteboard.save(function(err) {
        if(!err) {
            console.log('whiteboard "'+req.body.name+'" created!');
            User.findById(req.session.user._id, function(err,user) {
                if(!err) {
                    console.log('works here?');
                    var assignment = new Assignment({
                        color      : [100,100,100],
                        isOwner    : true,
                        whiteboard : whiteboard
                    });
                    console.log('works here too?');
                    user.assignments.push(assignment);
                    user.save(function(err) {
                        if(!err) {
                            console.log('assignment added');
                        } else {
                            console.log('ERROR: assignment wasnt added');
                        }
                    })
                }
            });
            res.send({name:req.body.name});
        } else {
            console.log('[ERROR] ',err);
        }
    });
})

app.get('/whiteboard/:id',function(req,res) {
    res.send(req.params.id);
})



/* -------------------------------------------- */

app.get('/see/assignments',function(req,res) {
    Assignment.find(function(err,users) {
        res.send(JSON.stringify(users));
    })
})
app.get('/see/whiteboard',function(req,res) {
    Whiteboard.find(function(err,users) {
        res.send(JSON.stringify(users));
    })
})
app.get('/whiteboards/remove',function(req,res) {
    Whiteboard.find({}, function(err,user) {
        for(var i = 0; i < user.length; ++i) {
            user[i].remove();
        }
        res.send('All whiteboards removed!');
    })
})
app.get('/assignments/remove',function(req,res) {
    Assignment.find({}, function(err,user) {
        for(var i = 0; i < user.length; ++i) {
            user[i].remove();
        }
        res.send('All Assignments removed!');
    })
})

app.listen(3000);