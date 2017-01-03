var mongoose = require("mongoose");

// Schema setup
var campgroungSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// var Campground = mongoose.model("Campground", campgroungSchema);
// exporting model
module.exports = mongoose.model("Campground", campgroungSchema);