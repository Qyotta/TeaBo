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

var Schema           = mongoose.Schema,
    ObjectId         = Schema.ObjectId,
    QueryObjectId    = mongoose.Types.ObjectId,
    userID           = 0,
    assignmentID     = 0,
    whiteboardID     = 0,
    whiteboardItemID = 0,
    SettingsSchema = new Schema({
        key    : String,
        value  : String,
        userID : Number
    }),
    UserSchema = new Schema({
        email       : String,
        password    : String,
        firstname   : String,
        lastname    : String,
        position    : String,
        settings    : [SettingsSchema]
    }),
    AssignmentSchema = new Schema({
        color      : [Number],
        user       : [UserSchema],
        isOwner    : Boolean,
        whiteboard : [WhiteboardSchema]
    }),
    WhiteboardSchema = new Schema({
        name        : String,
        x           : Number,
        y           : Number
    }),
    WhiteboardItemSchema = new Schema({
        editing      : Boolean,
        orderIndex   : Number,
        x            : Number,
        y            : Number,
        creator      : ObjectId
    }),
    
    Settings        = mongoose.model('Settings',SettingsSchema),
    User            = mongoose.model('User', UserSchema),
    Assignment      = mongoose.model('Assignment', AssignmentSchema),
    Whiteboard      = mongoose.model('Whiteboard', WhiteboardSchema),
    WhiteboardItems = mongoose.model('WhiteboardItem', WhiteboardItemSchema);
    
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
            req.session.user = user;
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
            console.log('login successful for ',user.email);
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

// TODO implement
app.post('/user/settings',function(req,res) {
    res.send('true');
})

app.get('/whiteboard', function(req,res) {
    if(req.session.user) {
        Assignment.find({'user._id':req.session.user._id},function(err,assignedWhiteboards) {
            var whiteboards = [];
            for(var i = 0; i < assignedWhiteboards.length; ++i) {
                whiteboards.push({
                    _id: assignedWhiteboards[i].whiteboard[0]._id,
                    name: assignedWhiteboards[i].whiteboard[0].name,
                    x: assignedWhiteboards[i].whiteboard[0].x,
                    y: assignedWhiteboards[i].whiteboard[0].y,
                    isOwner: assignedWhiteboards[i].isOwner
                });
            }
            res.header('Transfer-Encoding','chunked');
            res.header('Content-Type','application/json');
            res.send(whiteboards);            
        })
    } else {
        res.send('');
    }
})

app.post('/whiteboard', function(req,res) {
    var whiteboard = new Whiteboard({
        name: req.body.name,
        x: 0,
        y: 0
    });
    whiteboard.save(function(err) {
        User.findById(req.session.user._id, function(err,user) {
            var assignment = new Assignment({
                color      : [100,100,100],
                user       : [user],
                isOwner    : true,
                whiteboard : [whiteboard]
            });
            assignment.save();
            res.send({
                _id:whiteboard._id,
                name:req.body.name,
                x: 0,
                y: 0,
                isOwner: true
            });
            console.log('whiteboard "'+req.body.name+'" created!');
        });
    });
})

app.delete('/whiteboard/:id', function(req,res) {
    Whiteboard.findById(req.params.id, function(err, whiteboard) {
        if(whiteboard) {
            Assignment.find({'whiteboard._id':new QueryObjectId(req.params.id)},function(err,assignments) {
                for(var i = 0; i < assignments.length; ++i) {
                    assignments[i].remove();
                    console.log('whiteboard and assignments removed');
                }
                whiteboard.remove();
            })
        }
    });
    return res.send('');
});

app.get('/whiteboard/:id',function(req,res) {
    res.send(req.params.id);
})



/* -------------------------------------------- */

app.get('/see/assignments',function(req,res) {
    Assignment.find({},function(err,users) {
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
app.get('/user/remove',function(req,res) {
    User.find({}, function(err,user) {
        for(var i = 0; i < user.length; ++i) {
            user[i].remove();
        }
        res.send('All users removed!');
    })
})
app.get('/clearDB',function(req,res) {
    Whiteboard.find({}, function(err,user) {
        for(var i = 0; i < user.length; ++i) {
            user[i].remove();
        }
    })
    Assignment.find({}, function(err,user) {
        for(var i = 0; i < user.length; ++i) {
            user[i].remove();
        }
    })
    User.find({}, function(err,user) {
        for(var i = 0; i < user.length; ++i) {
            user[i].remove();
        }
    })
    
    var user = new User({
        email:'max-mustermann@gmail.com',
        password:'testtest'
    });
    user.save();

    res.send('DB cleared!');
    
});
app.listen(3000);