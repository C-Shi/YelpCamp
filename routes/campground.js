// because in app.js we wrote app.use("/campground", campgroundRoute), so this file only excute when a request make to 
// "/campground", so the route in here do not need to have /campground

var express = require("express");
var router  = express.Router();
var campground = require("../models/campground");
var middlewareObj = require("../middleware");


//Index route - show all basic campground info
router.get("/", function (req, res) {
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, campgrounds) {
        campground.count().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {
                    campgrounds: campgrounds,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
            }
        });
    });
});


//CREATE routes - post request, add new campground to db 
router.post("/", middlewareObj.isLogin,function(req, res){
  // catch info of currently loggedin user
  var author  = {
      id: req.user.id,
      username: req.user.username
  };
  var newCamp = {name:req.body.name, image:req.body.image, author:author, price: req.body.price, description: req.body.description};
  campground.create(newCamp,function(err){
      if (err){
          console.log(err);
      }
  })
  req.flash("success", "You have created " + req.body.name);
  res.redirect("campground");
});

//NEW routes - get request, displays form to make new campground
router.get("/new", middlewareObj.isLogin,function(req,res){
    res.render("campgrounds/new");
});

//SHOW route - show more info about a specific campground
router.get("/:id", function(req,res){
    campground.findById(req.params.id).populate("comment").exec(function(err, foundCampground){
        if(!err){
            res.render("campgrounds/show", {campground:foundCampground}); 
        }
    })
})


// EDIT route
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req,res){
    campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err);
            req.flash("success", "You have updated " + foundCampground.name)
            res.redirect("/campground");
        }else{
            res.render("campgrounds/edit", {campground:foundCampground});
        }
    })
})

//UPDATE route
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req,res){
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campground");
        }else{
            req.flash("success", "You updated " + foundCampground.name);
            res.redirect("/campground/" + req.params.id);
        }
    })
})

//Delete Routes
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req,res){
    campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "You have deleted a campground");
            res.redirect("/campground");
        }
    })
})


// ************************************************

module.exports = router;