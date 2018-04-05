var campground = require("../models/campground"),
    comment    = require("../models/comment");
    
    
var middlewareObj = new Object();

middlewareObj.isLogin = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Sorry! You need to login first");
    res.redirect("/login");
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log("no comment found");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user.id)){
                    return next();
                }else{
                    req.flash("error", "Sorry! You do not have permission to do that");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error", "Sorry! You need to log in first");
        res.redirect("back");
    }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        // need to find the campground first
        campground.findById(req.params.id, function(err, foundCampground){
            //foundCampground.author.id is a mongo object
            //req.user.id is a string
            // therefore need to use mongoose method .equals() to compare
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user.id)){
                    return next();
                  }else{
                    req.flash("error", "Sorry! You do not have permission to do that");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error", "Sorry! You need to log in first");
        res.redirect("back");
    }
}

middlewareObj.checkPasswordLength = function(req, res, next){
    if (req.body.password.length >= 6) {
        return next();
    }
    req.flash("error", "Your password is too short. To protect your safety, your password has to be at least 6 characters");
    res.redirect("/register");
}

module.exports = middlewareObj;