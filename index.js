//external dependencies
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var undot = require('undot');
var assert = require('assert');
var Users = undot('models/user');
var Blogs = undot('models/blog');
var Comments = undot('models/comment');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
//var ValUsers = undot('models/userHelper');
//var ValBlogs = undot('models/blogHelper');
var helper = undot('/helper');
var fileUpload = require('express-fileupload');
var path = require('path');
var fs = require('fs');


//starters
var app = express();
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: true });
//app.use(expressJWT({ secret: 'blogs' }).unless({ path: ['/', '/login', '/signup'] }));
// Use native promises
mongoose.Promise = global.Promise;

var apiRoutes = express.Router();


var upload = multer({ dest: '/public/uploads/' });
//app.use(bodyParser({ uploadDir: '/public/uploads/' }));



//DB Connection
mongoose.connect('mongodb://localhost/Blogging');


apiRoutes.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.token;
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'blogs', function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});


//-------------TEST START-------------
app.post('/upp', upload.single('img'), function(req, res) {
    console.log(helper.GetFilePath(req.file));
});

app.post('/upload', upload.single('image'), function(req, res) {
    if (req.file) {
        console.log("yes");
    } else {
        console.log("Nio")
    }
    //console.log(req.file.mimetype);
    //console.log(req.file.originalname);
    var tempPath = req.file.path;
    //console.log(req.file.path);
    //var targetPath = path.resolve('./public/uploads/image.png'+Date.now()+path.extname(req.file.originalname).toLowerCase());
    var dbPath = './public/uploads/blogs/' + Date.now() + path.extname(req.file.originalname).toLowerCase();
    //var targetPath = path.resolve('./public/uploads/blogs/' + Date.now() + path.extname(req.file.originalname).toLowerCase());
    var targetPath = path.resolve(dbPath);
    //console.log(dbPath.substring(2));
    //console.log(targetPath);
    //console.log((path.extname(targetPath).toLowerCase() === '.png'));
    //if (path.extname(req.file.originalname).toLowerCase() === '.png') 
    if (helper.GetFileExtention(req.file.originalname)) {
        fs.rename(tempPath, targetPath, function(err) {
            if (err) {
                throw err;
            } else {
                console.log("Upload completed!");
                res.status(200).end(JSON.stringify({
                    error: false,
                    message: "Succesfully Uploaded"
                }));
            }
        });
    } else {
        fs.unlink(tempPath, function(err) {
            if (err) {
                throw err;
            } else {
                console.error("Only .png files are allowed!");
                res.status(200).end(JSON.stringify({
                    error: false,
                    message: "Please upload images with .png , .jpg , .bmp and .jpeg extentions"
                }));
            }
        });
    }
});
app.get('/', function(req, res) {
    res.status(200).end("Hello World");
    /*Users.find({}, function(err, data) {
        if (err) throw err;
        console.log(data);
        res.end(data);
    });*/
});
///---------------END TESTS------------------

//REST API's


//Login EndPoints
app.post('/login', upload.array(), function(req, res) {
    console.log(req.body.email);
    console.log(req.body.password);
    if (!req.body.email) {
        res.status(400).send("Email is required!");
        return;
    }
    if (!req.body.password) {
        res.status(400).send("Password is required!");
        return;
    }
    helper.GetSingleUser(req.body.email, req.body.password, function(err, person) {
        if (person === null) {
            res.status(404).end(JSON.stringify({
                "error": "false",
                "message": "Person not found"
            }));
        } else {
            res.status(200).end(JSON.stringify({
                "error": "false",
                "token": jwt.sign({ email: req.body.email, id: person._id }, 'blogs', { expiresIn: '24h' }),
                //"Token": jwt.sign({ email: req.body.email, iat: Math.floor(Date.now() / 1000) - 30 }, 'blogs'),
                "message": "You have succesfully logged in.",
                "person": person
            }));
        }
    });
    /*Users.findOne({ email: req.body.email, password: req.body.password }, function(err, person) {
        if (err) {
            throw err;
        } else if (person === null) {
            res.end(JSON.stringify({
                "error": "false",
                "message": "Person not found"
            }));
        } else {
            res.end(JSON.stringify({
                "error": "false",
                "message": "You have succesfully logged in.",
                "person": person
            }));
        }
    });*/
});


//Signup EndPoints
app.get('/signup', function(req, res) {
    res.end(JSON.stringify({
        "error": false,
        "Message": "Email, Password, Profile Picture and Username is all you need for signup."
    }));
});

app.post('/signup', upload.single('image'), function(req, res) {

    if (req.file && (helper.ValidateUser(req.body.email, req.body.password, req.body.username, req.file.originalname)))
    //if(ValUsers.ValidateEmail(req.body.email) && ValUsers.ValidatePassword(req.body.password) && ValUsers.ValidateUsername(req.body.username)) {
    {
        var newUser = new Users({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            image_path: helper.GetFilePath(req.file)
        });
        newUser.save(function(err) {
            if (err) {
                throw err;
            } else {
                console.log("New User Saved");
            }
        });
        res.status(200).end(JSON.stringify({
            error: false,
            "message": "User Succesfully added.",
            "user credentials": newUser
        }));
    } else {
        res.status(412).end(JSON.stringify({
            error: false,
            "message": "Invalid User credential."
        }));
    }
});


//Update EndPoints
apiRoutes.get('/user/:id', function(req, res) {
    helper.GetSingleUserOnID(req.params.id, function(err, person) {
        if (person === null) {
            res.status(404).end(JSON.stringify({
                "error": "false",
                "message": "Person not found"
            }));
        } else {
            res.status(200).end(JSON.stringify({
                "error": "false",
                //"token": jwt.sign({ email: req.body.email, id: person._id }, 'blogs', { expiresIn: '24h' }),
                //"Token": jwt.sign({ email: req.body.email, iat: Math.floor(Date.now() / 1000) - 30 }, 'blogs'),
                "message": "User Found.",
                "person": person
            }));
        }
    });
});
apiRoutes.post('/updateProfile/:id', upload.single('image'), function(req, res) {
    var decoded = jwt.decode(req.headers.token, { complete: true });
    //console.log(decoded.header);
    //console.log(decoded.payload);

    if (req.file && decoded.payload.id == req.params.id) {
        Users.findOneAndUpdate({ id: req.params.id }, {
            $set: {
                name: req.body.name,
                password: req.body.password,
                image_path: helper.GetFilePath(req.file),
                updated_date: Date.now()

            }
        }, function(err, doc) {
            if (err) {
                throw err;
            } else {
                helper.GetSingleUserOnID(req.params.id, function(err, person) {
                    if (person === null) {
                        res.status(404).end(JSON.stringify({
                            "error": "false",
                            "message": "Person not found"
                        }));
                    } else {
                        res.status(200).end(JSON.stringify({
                            "error": "false",
                            //"token": jwt.sign({ email: req.body.email, id: person._id }, 'blogs', { expiresIn: '24h' }),
                            //"Token": jwt.sign({ email: req.body.email, iat: Math.floor(Date.now() / 1000) - 30 }, 'blogs'),
                            "message": "User Updated Details.",
                            "person": person
                        }));
                    }
                });
            }
        });
    }

    res.end();
});
apiRoutes.put('/updateProfile/:id', function(req, res) {
    res.status(404).end(JSON.stringify({
        "error": "true",
        "message": "API Not Found"
    }));
});

//Post EndPoints
apiRoutes.get('/post/:id', function(req, res) {
    helper.GetSinglePostOnID(req.params.id, function(err, post) {
        if (post === null) {
            res.status(404).end(JSON.stringify({
                "error": "false",
                "message": "Post not found"
            }));
        } else {
            res.status(200).end(JSON.stringify({
                "error": "false",
                //"token": jwt.sign({ email: req.body.email, id: person._id }, 'blogs', { expiresIn: '24h' }),
                //"Token": jwt.sign({ email: req.body.email, iat: Math.floor(Date.now() / 1000) - 30 }, 'blogs'),
                "message": "Post Found.",
                "post": post
            }));
        }
    });
});
apiRoutes.post('/post', upload.single('image'), function(req, res) {
    var decoded = jwt.decode(req.headers.token, { complete: true });
    if (decoded.payload.id) {
        helper.GetSingleUserOnID(decoded.payload.id, function(err, person) {
            if (person === null) {
                res.status(404).end(JSON.stringify({
                    "error": "false",
                    "message": "Person not found"
                }));
            } else {
                console.log(helper.ValidatePost(req.body.content, req.body.title));
                if (helper.ValidatePost(req.body.content, req.body.title)) {
                    var newBlog = Blogs({
                        content: req.body.content,
                        title: req.body.title,
                        author: person._id,
                        published: true,
                        image_path: helper.GetFilePathForBlog(req.file),
                        //comments: []
                    });
                    newBlog.save(function(err) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("Post Saved succesfully.");
                            res.status(200).end(JSON.stringify({
                                "error": false,
                                "message": "Post succesfully."
                            }));
                        }
                    });
                } else {
                    res.status(500).end(JSON.stringify({
                        "error": false,
                        "message": "Post was not saved."
                    }));
                }
            }
        });
    }
});
apiRoutes.put('/post/:id', function(req, res) {
    res.status(404).end(JSON.stringify({
        "error": "true",
        "message": "API Not Found"
    }));
});
apiRoutes.delete('/post/:id', function(req, res) {
    res.status(404).end(JSON.stringify({
        "error": "true",
        "message": "API Not Found"
    }));
});

//Comments EndPoints
apiRoutes.post('/comment/:postId', upload.single('image'), function(req, res) {
    var decoded = jwt.decode(req.headers.token, { complete: true });
    if (decoded.payload.id) {
        console.log(decoded.payload.id);
        helper.GetSingleUserOnID(decoded.payload.id, function(err, person) {
            if (person === null) {
                res.status(404).end(JSON.stringify({
                    "error": "false",
                    "message": "Person not found"
                }));
            } else {
                helper.GetSinglePostOnID(req.params.postId, function(err, post) {
                    if (err) throw err;
                    console.log(post);
                    var newComment = new Comments({
                        comment_content: req.body.content,
                        commenter: person._id,
                        image_path: helper.GetFilePathForBlog(req.file),
                        published: true
                    });
                    var condition = { _id: post._id },
                        update = { $push: { comments: [newComment] } };
                    //post.comments.push(newComment);
                    post.findByIdAndUpdate(post._id, { $push: { "comments": { newComment } } })
                    post.update(condition, update, function(err) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("Post Comment succesfully.");
                            res.status(200).end(JSON.stringify({
                                "error": false,
                                "message": "Comment succesfully posted."
                            }));
                        }
                    });
                    /*post.save(function(err) {
                        if (err) {
                            throw err;
                        } else {
                            console.log("Post Comment succesfully.");
                            res.status(200).end(JSON.stringify({
                                "error": false,
                                "message": "Comment succesfully posted."
                            }));
                        }
                    });*/
                });
            }
        });
    }
});

apiRoutes.get('/comment/:postId', function(req, res) {
    res.status(404).end(JSON.stringify({
        "error": "true",
        "message": "API Not Found"
    }));
});
apiRoutes.put('/comment/:postId', function(req, res) {
    res.status(404).end(JSON.stringify({
        "error": "true",
        "message": "API Not Found"
    }));
});
apiRoutes.delete('/comment/:postId', function(req, res) {
    res.status(404).end(JSON.stringify({
        "error": "true",
        "message": "API Not Found"
    }));
});



app.get('/searchBlog/:blogTitle', function(req, res) {
    Blogs.findOne({ title: req.params.blogTitle }, function(err, blog) {
        if (err) {
            throw err;
        } else {
            if (blog) {
                res.status(200).end(JSON.stringify({
                    "error": false,
                    "message": "blog found",
                    "blog_details": blog
                }));
            } else {
                res.status(404).end(JSON.stringify({
                    "error": false,
                    "message": "no blog found"
                }));
            }
        }
    });
});


app.use('/api', apiRoutes);

process.on('SIGINT', function() {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    mongoose.connection.close();
    process.exit();
});


var server = app.listen(8040, function() {
    console.log("Blogging app listening at http:localhost:8040");
});