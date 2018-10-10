var mongoose = require("mongoose");
module.exports = mongoose.model("Bucket",{
    "id":Number,
    "pics":Array,
    "files":Array,
    "description":String,
    "modifier":String,
    "title":String
})