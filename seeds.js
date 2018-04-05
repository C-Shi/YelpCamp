
var campground = require("./models/campground");
var comment = require("./models/comment");
var User = require("./models/user");
var passport = require("passport");

var data = [
        { name: "Banff forest",
          image: "https://webmedia.westgateresorts.com/prometheus/getImage?id=42252&width=1500&height=1012",
          price: "12.50",
          description: "Cu probo mucius scribentur mea, et vix propriae antiopam intellegat. Copiosae argumentum his ne. Ne porro malis patrioque eam, vis ut dico percipitur interpretaris, cu bonorum tractatos complectitur cum. No eirmod patrioque referrentur eum, ea labitur bonorum maiorum eam. Ad labore eripuit legendos usu. Suscipit consequuntur definitionem has eu. Id mel congue noluisse tractatos, no duo eirmod gloriatur, his explicari liberavisse ei.",
        },
        { name: "Yellow Knife ShowCamp",
          image: "http://jacksonholecampground.com/wp-content/uploads/2013/01/glamp-1.jpg",
          price: "22.00",
          description: "Cu probo mucius scribentur mea, et vix propriae antiopam intellegat. Copiosae argumentum his ne. Ne porro malis patrioque eam, vis ut dico percipitur interpretaris, cu bonorum tractatos complectitur cum. No eirmod patrioque referrentur eum, ea labitur bonorum maiorum eam. Ad labore eripuit legendos usu. Suscipit consequuntur definitionem has eu. Id mel congue noluisse tractatos, no duo eirmod gloriatur, his explicari liberavisse ei.",
        },
    ];
    
function seedDB(){
   removeAll();
}


function removeAll(){
    campground.remove({},function(err, campground){
        if(err){
            console.log(err);
        }else{
            console.log("remove all campgrounds");
            comment.remove({},function(err, comment){
                if (!err){
                    console.log("remove all comments");
                    clearUser();
                }
            });
        }
    });
}

function addUser(){
    User.register(User({username:"home"}), "password", function(err){
        if(!err){
            passport.authenticate('local');
            console.log("add a user 'home'");
            User.findOne({"username": "home"}, function(err, user){
                if (err){
                    console.log('err from find', err);
                }else{
                    addTwoCampground(user);
                }
            });
        }
    });
}

function addTwoCampground(user){
    data.forEach(function(camp){
        camp.author = {
           id:user._id,
           username:user.username
        };
        campground.create(camp, function(err, campground){
            if (err){
                console.log(err);
            }else{
                console.log("add a campground");
                console.log("associated campground with user");
                comment.create({
                    text: "This is a great place but no internet",
                    author: camp.author
                }, function(err, comment){
                    if (!err){
                        console.log("add comment");
                        console.log("associated comment with campground and user");
                        campground.comment.push(comment);
                        campground.save();
                       
                    }
                })
            }
        })
    })
}

function clearUser(){
    User.remove({}, function(err, user){
        if(!err){
            console.log("remove all users");
            addUser();
        }
    })
}



module.exports = seedDB;