var express = require("express");
var router = express.Router({mergeParams: true}); //otherwise findById wouldn't work
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// COMMENTS ROUTES - NESTED ROUTES
// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // findById
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});
// POST
router.post("/", middleware.isLoggedIn, function(req, res) {
    // findById
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {    // create new comment       
            Comment.create(req.body.comment, function(err, comment) { // names in inputs were both like comment[text]...
               if(err) {
                   req.flash("error", "Something went wrong...");
                   console.log(err);
               } else {
                   // add username and id to comment and save
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   campground.comments.push(comment); // connect comment
                   campground.save();
                   req.flash("success", "Comment Added");
                   res.redirect("/campgrounds/" + campground._id); // redirect to campground show
               }
            });
        }
    });
});
// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});
// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Edited");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
// DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;