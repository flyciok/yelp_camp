var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); // it will automaticly require index.js if has only direction. so we can skip /index.js

// RESTFUL ROUTES - CRUD FUNCTIONALITY
// INDEX
router.get("/", function(req, res) {
    // Getting all camgrounds
    Campground.find({}, function(err, allcampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allcampgrounds});
        }
    });
});
// CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    // grabbing input from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
    
    // creating new campground and saving in db
    Campground.create(newCampground, function(err, newcamp) {
        if(err) {
            console.log(err);
        } else {
            // redirecting
            res.redirect("/campgrounds");
        }
    });
});
// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});
// SHOW - shows more of element on index page /camp/:id (GET)
router.get("/:id", function(req, res) { //must be below .../new
    // find camp with provided ID // && populating comments to campground items
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            // console.log(foundCampground);
            // render page with selected camp
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
// EDIT - form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) { // error handled by middleware
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
// UPDATE - logic
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // find and update correct camp
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            // redirect
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) { // error handled by middleware
        res.redirect("/campgrounds");
    });
});

module.exports = router;