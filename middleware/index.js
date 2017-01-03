// ALL THE MIDDLEWARE
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// login and permission check middleware
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    // is user logged in?
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // does user own campground?
                if(foundCampground.author.id.equals(req.user._id)) { // have to be handled this way, becaouse one of them is mongoose object
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged in?
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) { // have to be handled this way, becaouse one of them is mongoose object
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

// login check middleware
middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that"); // will be displayed after going to next page (smart!)
    res.redirect("/login");
};

module.exports = middlewareObj; // crucial