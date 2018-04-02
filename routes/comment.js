var express = require("express");
// {mergeParams:true} -- perseve the req.params info from the parent router, in this case, app.use("/campground/:id/comment") in the app.js
var router  = express.Router({mergeParams:true});
var campground = require("../models/campground");
var comment = require("../models/comment");
var middlewareObj = require("../middleware");

// ========== NESTED ROUTES FOR COMMENTS ===============

// NEW routes - display form to make commets
router.get("/new", middlewareObj.isLogin, function(req,res){
    //find Campground's id not the req's id
    campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log("No such campground");
            res.redirect("/campground");
        }else{
            res.render("comments/new", {campground:campground});
        }
    })
})

// CREATE routes - add new comments to campground
router.post("/", middlewareObj.isLogin, function(req, res){
    //findID
    campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
        }else{
            comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.username = req.user.username;
                    comment.author.id       = req.user.id;
                    comment.save();
                    foundCampground.comment.push(comment);
                    foundCampground.save();
                    req.flash("success", "You added a comment to " + foundCampground.name)
                    res.redirect("/campground/" + req.params.id);
                }
            })
        }
    })
    //Redirect
})

//edit comments routes
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership,function(req, res){
    campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log("do not find campground");
        }else{
            comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    console.log("do not find comment");
                }else{
                    res.render("comments/edit", {campground:foundCampground, comment:foundComment})
                }
            })
        }
    })
})

//update comments routes
router.put("/:comment_id", middlewareObj.checkCommentOwnership,function(req, res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
        if(err){
            console.log("cannot update comment");
        }else{
            req.flash("success", "You updated a comment");
            res.redirect("/campground/" + req.params.id);
        }
    })
})

// Delete comments
router.delete("/:comment_id/", middlewareObj.checkCommentOwnership,function(req,res){
    comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log("cannot find comment");
        }else{
            req.flash("success", "You deleted a comment");
            res.redirect("back");
        }
    })
})
// ========== END NESTED ROUTES FOR COMMENTS ===========

module.exports = router;