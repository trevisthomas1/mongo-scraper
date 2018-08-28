var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ScrapedSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});

var Scraped = mongoose.model("Scraped", ScrapedSchema);

module.exports = Scraped;
