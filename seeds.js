
var campground = require("./models/campground");
var comment = require("./models/comment");
var User = require("./models/user");
var passport = require("passport");
var faker = require("faker");

var data = new Array;

for(let i = 0; i < 20; i++){
    data[i] = {
        name: faker.company.companyName(),
        image: 'https://webmedia.westgateresorts.com/prometheus/getImage?id=42252&width=1500&height=1012',
        price: faker.commerce.price(),
        description: faker.lorem.paragraph()
    }
}
// var data = [
//         { name: "Banff forest",
//           image: "https://webmedia.westgateresorts.com/prometheus/getImage?id=42252&width=1500&height=1012",
//           price: "12.50",
//           description: "Cu probo mucius scribentur mea, et vix propriae antiopam intellegat. Copiosae argumentum his ne. Ne porro malis patrioque eam, vis ut dico percipitur interpretaris, cu bonorum tractatos complectitur cum. No eirmod patrioque referrentur eum, ea labitur bonorum maiorum eam. Ad labore eripuit legendos usu. Suscipit consequuntur definitionem has eu. Id mel congue noluisse tractatos, no duo eirmod gloriatur, his explicari liberavisse ei.",
//         },
//         { name: "Yellow Knife ShowCamp",
//           image: "http://jacksonholecampground.com/wp-content/uploads/2013/01/glamp-1.jpg",
//           price: "22.00",
//           description: "Cu probo mucius scribentur mea, et vix propriae antiopam intellegat. Copiosae argumentum his ne. Ne porro malis patrioque eam, vis ut dico percipitur interpretaris, cu bonorum tractatos complectitur cum. No eirmod patrioque referrentur eum, ea labitur bonorum maiorum eam. Ad labore eripuit legendos usu. Suscipit consequuntur definitionem has eu. Id mel congue noluisse tractatos, no duo eirmod gloriatur, his explicari liberavisse ei.",
//         },
//         { name: "Horneymoon Lake Camp",
//           image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d9df10d159cc11074d9a7996e8aca442&auto=format&fit=crop&w=1350&q=80",
//           price: "17.00",
//           description: "Cu probo mucius scribentur mea, et vix propriae antiopam intellegat. Copiosae argumentum his ne. Ne porro malis patrioque eam, vis ut dico percipitur interpretaris, cu bonorum tractatos complectitur cum. No eirmod patrioque referrentur eum, ea labitur bonorum maiorum eam. Ad labore eripuit legendos usu. Suscipit consequuntur definitionem has eu. Id mel congue noluisse tractatos, no duo eirmod gloriatur, his explicari liberavisse ei.",
//         },
//         { name: "Mount forever",
//           image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=45fc8a446ad11a120c543c426382119f&auto=format&fit=crop&w=1350&q=80",
//           price: "7.50",
//           description: "Cu probo mucius scribentur mea, et vix propriae antiopam intellegat. Copiosae argumentum his ne. Ne porro malis patrioque eam, vis ut dico percipitur interpretaris, cu bonorum tractatos complectitur cum. No eirmod patrioque referrentur eum, ea labitur bonorum maiorum eam. Ad labore eripuit legendos usu. Suscipit consequuntur definitionem has eu. Id mel congue noluisse tractatos, no duo eirmod gloriatur, his explicari liberavisse ei.",
//         },
//         { name: "Icy Ground Campsite",
//           image: "https://images.unsplash.com/photo-1421885641996-b1f3d004d401?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4e80b57a79b2419faca15c165be3c871&auto=format&fit=crop&w=1371&q=80",
//           price: "24.50",
//           description: "Cu probo mucius scribentur mea, et vix propriae antiopam intellegat. Copiosae argumentum his ne. Ne porro malis patrioque eam, vis ut dico percipitur interpretaris, cu bonorum tractatos complectitur cum. No eirmod patrioque referrentur eum, ea labitur bonorum maiorum eam. Ad labore eripuit legendos usu. Suscipit consequuntur definitionem has eu. Id mel congue noluisse tractatos, no duo eirmod gloriatur, his explicari liberavisse ei.",
//         },
//     ];
    
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