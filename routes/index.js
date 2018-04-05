var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middlewareObj = require("../middleware");

// expressRoute 是一个可以吧路由组合起来输出到其他文件的插件

//ABOUT routes
router.get("/about", function(req,res){
    res.render("about");
})

// LANDING routes
router.get("/", function(req,res){
    res.render("landing");
});

// User Authenticate Routes **************
router.get("/register", function(req, res){
    res.render("register");
})

router.post("/register", middlewareObj.checkPasswordLength, function(req,res){
    User.register(User({username:req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("failure", err.message);
            return res.redirect("/register");
        }
        
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "You have signed up as " + req.body.username + "! Welcome to YelpCamp")
            res.redirect("/campground");
        })
    })
})

// User Login Routes ********************
router.get('/login', function(req,res){
    res.render("login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campground",
    failureRedirect: "/login",
    // successFlash/failureFlash automatically pass key of "success" and "error", not other key
    successFlash: "Welcome! You have logged in",
    failureFlash: "Invaild Username or Password"
}), function (req, res){
})

// User Logout Routes ********************
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "You have logged out");
    res.redirect("/");
})

// END OF ROUTES ******************************************

module.exports = router;