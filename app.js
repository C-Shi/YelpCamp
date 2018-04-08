var bodyParser     = require("body-parser"),
    express        = require("express"),
    request        = require("request"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    User           = require("./models/user"),
    campground     = require("./models/campground"),
    comment        = require("./models/comment"),
    methodOverride = require("method-override"),
    seedDB         = require("./seeds");
    
var campgroundRoute = require("./routes/campground"),
    commentRoute    = require("./routes/comment"),
    indexRoute      = require("./routes/index");
    
var PORT = process.env.PORT || 3000;

var app = express();
mongoose.connect("mongodb://localhost/app_campground_v14");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(flash());

// User Authenticate CONFIG - PASSPORT CONFIG -------------------------// 
app.use(require("express-session")({
    secret: "Do you love me?",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// configure a new localStrategy and tell passport to use User.authenticate()
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// -------------------------------------------------------------------//

// because useing user() method, this need to config after passport
app.use(function(req, res, next){
    // locals refers to whatever ejs file the request is getting to 
    // this code ensure that in all ejs file we have access to the logged in user as "currentUser"
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});



// run campgroundRoute when a request make to /campground
app.use(methodOverride("_method"));
app.use("/campground",campgroundRoute);
app.use("/campground/:id/comments",commentRoute);
app.use("/",indexRoute);

app.listen(PORT, function(){
    console.log("Server Started!");
})

//seedDB();